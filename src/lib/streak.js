import { supabase } from "./supabase"

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function dateKeyFromValue(value) {
  if (!value) return null
  return localDateKey(new Date(value))
}

export async function syncUserStreak(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, streak, last_active")
    .eq("id", userId)
    .single()

  if (error || !data) return data

  const today = localDateKey()
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = localDateKey(yesterdayDate)
  const lastActive = dateKeyFromValue(data.last_active)

  if (lastActive === today) return data

  const newStreak = lastActive === yesterday ? (data.streak || 0) + 1 : 1
  const updatedProfile = {
    ...data,
    streak: newStreak,
    last_active: new Date().toISOString(),
  }

  let updateQuery = supabase
    .from("profiles")
    .update({ streak: newStreak, last_active: updatedProfile.last_active })
    .eq("id", userId)

  updateQuery = data.last_active
    ? updateQuery.eq("last_active", data.last_active)
    : updateQuery.is("last_active", null)

  const { error: updateError } = await updateQuery

  if (!updateError) return updatedProfile

  const { data: latest } = await supabase
    .from("profiles")
    .select("name, streak, last_active")
    .eq("id", userId)
    .single()

  return latest ?? updatedProfile
}
