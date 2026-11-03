// Supabase integration: серверлесс-авторизация, облачное сохранение прогресса и живой лидерборд.

const SUPABASE_CONFIG = {
  url: "https://ocsgrqmojjyscmpifnid.supabase.co",
  anonKey: "sb_publishable_PEJm1CHjxZASDdaPuADOsQ_QRSYnhHd",
};

let sbClient = null;

function getSupabase() {
  if (sbClient) return sbClient;
  const url = store.get("sb_url", SUPABASE_CONFIG.url);
  const key = store.get("sb_key", SUPABASE_CONFIG.anonKey);
  if (window.supabase && url && key) {
    try {
      sbClient = window.supabase.createClient(url, key);
    } catch (e) {
      console.warn("Supabase init error:", e);
    }
  }
  return sbClient;
}

const isSupabaseReady = () => !!getSupabase();

// --- Авторизация: Регистрация ---
async function sbSignUp(email, password, username) {
  const sb = getSupabase();
  if (!sb) return { error: { message: "Supabase не инициализирован" } };

  // Если email без домена, добавляем @piscine.edu
  const validEmail = email.includes("@") ? email.trim() : `${email.trim().toLowerCase()}@piscine.edu`;

  const { data, error } = await sb.auth.signUp({
    email: validEmail,
    password: password,
    options: {
      data: { username: username.trim() },
    },
  });

  if (error) return { error };

  // Если сессия сразу создалась (Confirm email отключён в Supabase)
  if (data.session && data.user) {
    await sb.from("profiles").upsert({
      id: data.user.id,
      username: username.trim(),
      xp: 0,
      updated_at: new Date().toISOString(),
    });
  }

  return { data, email: validEmail };
}

// --- Авторизация: Вход ---
async function sbSignIn(email, password) {
  const sb = getSupabase();
  if (!sb) return { error: { message: "Supabase не инициализирован" } };

  const validEmail = email.includes("@") ? email.trim() : `${email.trim().toLowerCase()}@piscine.edu`;

  const { data, error } = await sb.auth.signInWithPassword({
    email: validEmail,
    password: password,
  });

  if (error) return { error };

  const user = data.user;
  let username = user.user_metadata?.username;

  // Загружаем профиль
  const { data: profile } = await sb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    username = profile.username;
  } else if (username) {
    await sb.from("profiles").upsert({
      id: user.id,
      username: username,
      xp: 0,
    });
  }

  // Загружаем прогресс студента из облака в localStorage
  if (username) {
    await sbRestoreProgress(user.id, username);
  }

  return { data, user, username, profile };
}

// --- Авторизация: Выход ---
async function sbSignOut() {
  const sb = getSupabase();
  if (sb) {
    try { await sb.auth.signOut(); } catch (e) { }
  }
}

// --- Восстановление прогресса из облака ---
async function sbRestoreProgress(userId, username) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { data: records, error } = await sb
      .from("progress")
      .select("task_id, assisted")
      .eq("user_id", userId);

    if (error || !records) return;

    const done = getDone(username);
    records.forEach(r => {
      done[r.task_id] = r.assisted ? "a" : true;
    });
    store.set("done:" + username, done);
  } catch (e) {
    console.warn("Error restoring progress:", e);
  }
}

// --- Синхронизация решённой задачи ---
async function sbSyncTask(taskId, xpGained, assisted) {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session || !session.user) return; // Гостевой локальный режим

    const userId = session.user.id;
    const u = getUser();

    // 1. Сохраняем в таблицу progress
    await sb.from("progress").upsert({
      user_id: userId,
      task_id: taskId,
      xp: xpGained,
      assisted: !!assisted,
      solved_at: new Date().toISOString(),
    });

    // 2. Обновляем общий XP в profiles
    const totalXp = xpOf(u);
    await sb.from("profiles").upsert({
      id: userId,
      username: u,
      xp: totalXp,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Background sync error:", e);
  }
}

// --- Живой лидерборд из облака ---
async function sbFetchLeaderboard(limit = 30) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("profiles")
      .select("username, xp")
      .order("xp", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) return null;
    return data.map(p => [p.username, p.xp]);
  } catch (e) {
    console.warn("Leaderboard fetch error:", e);
    return null;
  }
}

// --- Логирование и отслеживание гостя в Supabase ---
async function sbLogGuest(guestName) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const cleanName = (guestName || "Gopher").trim().slice(0, 20);
    const guestEmail = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@guest.piscine.edu`;
    const guestPass = "guest_" + Math.random().toString(36).slice(2, 12);

    const { data, error } = await sb.auth.signUp({
      email: guestEmail,
      password: guestPass,
      options: {
        data: { username: cleanName, is_guest: true },
      },
    });

    if (error) {
      console.warn("Guest sign-up warning:", error.message);
      return null;
    }

    if (data?.session && data?.user) {
      const guestDisplay = `[Гость] ${cleanName}`;
      await sb.from("profiles").upsert({
        id: data.user.id,
        username: guestDisplay,
        xp: 0,
        updated_at: new Date().toISOString(),
      });
      return { user: data.user, session: data.session };
    }
  } catch (e) {
    console.warn("sbLogGuest error:", e);
  }
  return null;
}

// --- Статистика пользователей и гостей для панели администратора ---
async function sbFetchAdminStats() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data: profiles, error } = await sb
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !profiles) return null;

    const registered = profiles.filter(p => !p.username.startsWith("[Гость]"));
    const guests = profiles.filter(p => p.username.startsWith("[Гость]"));
    const totalXp = profiles.reduce((acc, p) => acc + (p.xp || 0), 0);

    return {
      all: profiles,
      registered,
      guests,
      totalUsers: profiles.length,
      totalRegistered: registered.length,
      totalGuests: guests.length,
      totalXp,
    };
  } catch (e) {
    console.warn("sbFetchAdminStats error:", e);
    return null;
  }
}

