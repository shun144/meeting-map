import { type Tables } from "@/lib/supabase/schema";
import { supabase } from "./supabaseClient";
import { Destination } from "@/domains/Destination";

const DEFAULT_MAP_ID = import.meta.env.VITE_DEFAULT_MAP_ID as string;

export const fetchAllDestination = async (): Promise<Destination[]> => {
  try {
    const { data, error } = await supabase.from("destination").select("*");

    if (error) {
      console.error(error.message);
      throw error;
    }

    const destinations = data.map((x) => {
      return new Destination(x.id, [x.lng, x.lat], x.title);
    });

    return destinations;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error("目的地情報の取得に失敗しました");
    return [];
  }
};

type InsertDestinationArgs = {
  title?: string;
  lat: number;
  lng: number;
};

export const insertDestination = async (args: InsertDestinationArgs) => {
  try {
    const { title, lat, lng } = args;

    const { data, error: apiError } = await supabase
      .from("destination")
      .upsert({
        title,
        lat,
        lng,
        map_id: DEFAULT_MAP_ID,
      })
      .select("*");

    if (apiError) {
      throw new Error(apiError.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`目的地保存に失敗しました`);
    }
  }
};

// export const upsertDestination = async (args: Destination) => {
//   try {
//     const { data, error: apiError } = await supabase
//       .from("destination")
//       .upsert({
//         title,
//         lat,
//         lng,
//         map_id: DEFAULT_MAP_ID,
//       })
//       .select("*");

//     if (apiError) {
//       throw new Error(apiError.message);
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(`目的地保存に失敗しました`);
//     }
//   }
// };

// export const upsertMap = async () => {
//   const { data, error } = await supabase
//     .from("map")
//     .upsert({ name: "default" })
//     .select();
// };

// import { type Tables } from "@/lib/supabase/schema";
// import { supabase } from "./supabaseClient";
// import { User } from "@/domain/User";

// export const fetchAllUsers = async (): Promise<Tables<"users">[]> => {
//   const res = await supabase.from("users").select("*");
//   if (res.error) {
//     throw new Error(res.error.message);
//   }
//   return res.data;
// };

// export const fetchUser = async (userId: string) => {
//   const usersQuery = await supabase
//     .from("users")
//     .select("id, name, description, github_id, qiita_id, x_id")
//     .eq("id", userId);

//   if (usersQuery.error) {
//     throw new Error(usersQuery.error.message);
//   }

//   const userWithSkillQuery = await supabase
//     .from("user_skill")
//     .select("skill_id")
//     .eq("user_id", userId);

//   if (userWithSkillQuery.error) {
//     throw new Error(userWithSkillQuery.error.message);
//   }

//   const skillsQuery = await supabase
//     .from("skills")
//     .select("name")
//     .in(
//       "id",
//       userWithSkillQuery.data.flatMap((x) => x.skill_id),
//     );

//   if (skillsQuery.error) {
//     throw new Error(skillsQuery.error.message);
//   }

//   const userData = usersQuery.data[0];
//   const user = new User(
//     userData.id,
//     userData.name,
//     userData.description,
//     userData.github_id,
//     userData.qiita_id,
//     userData.x_id,
//     skillsQuery.data.map((x) => x.name),
//   );

//   return [user];
// };

// export const deleteUserCreatedTheDayBefore = async () => {
//   const yesterdayFrom = new Date();
//   yesterdayFrom.setDate(yesterdayFrom.getDate() - 1);
//   yesterdayFrom.setUTCHours(0, 0, 0, 0);

//   const yesterDayTo = new Date();
//   yesterDayTo.setDate(yesterDayTo.getDate() - 1);
//   yesterDayTo.setUTCHours(23, 59, 59, 999);

//   const querySelectUsers = await supabase
//     .from("users")
//     .select("id")
//     .gte("created_at", yesterdayFrom.toUTCString())
//     .lte("created_at", yesterDayTo.toUTCString());

//   if (querySelectUsers.error) {
//     throw new Error("ユーザー情報の取得に失敗しました");
//   }

//   const deleteUsers = querySelectUsers.data.map((x) => x.id);

//   if (deleteUsers.length === 0) {
//     console.log("削除対象ユーザは0件");
//   }

//   const queryDeleteUserSkill = await supabase
//     .from("user_skill")
//     .delete()
//     .in("user_id", deleteUsers);

//   const queryDeleteUsers = await supabase
//     .from("users")
//     .delete()
//     .in("id", deleteUsers);

//   if (!queryDeleteUserSkill.error && !queryDeleteUsers.error) {
//     console.log("削除完了", deleteUsers.length);
//   }
// };

// interface RegisterArgs {
//   englishWord: string;
//   userName: string;
//   description: string;
//   skills: number[];
//   githubId: string;
//   qiitaId: string;
//   xId: string;
// }

// export const insertUser = async (args: RegisterArgs) => {
//   const { error } = await supabase.rpc("insert_user_and_userskill", {
//     _user_id: args.englishWord,
//     _name: args.userName,
//     _description: args.description,
//     _skills: args.skills,
//   });

//   if (error) {
//     // → PostgreSQLのraiseで指定したエラーメッセージがここに出る
//     console.error("登録エラー:", error.message);
//   } else {
//     console.log("登録成功！");
//   }
// };
