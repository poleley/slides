import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>();
  const error = ref<string | null>();

  let userLocalStorage: string | null = localStorage.getItem("user")

  if (userLocalStorage) {
    try {
      user.value = JSON.parse(userLocalStorage);
    } catch (e) {
      console.log(e);
      localStorage.removeItem("user");
    }
  }

  const saveUserToLocalStorage = (user: User) => {
    const parsed = JSON.stringify(user);
    localStorage.setItem("user", parsed);
  };

  const signUp = async (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      password: password,
    };
    await axios
      .post("/api/v1/user/signup/", formData)
      .then((res) => {
        if (res.status === 201) {
          error.value = null;
          user.value = {
            id: res.data.id,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            email: res.data.email,
          };
          saveUserToLocalStorage(user.value!);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if ("email" in err.response.data)
            error.value = "Пользователь с такой почтой уже зарегистрирован";
          else error.value = "Пользователь с таким никнеймом уже зарегистрирован";
        } else {
          error.value = "Произошла неизвестная ошибка. Попробуйте еще раз";
        }
      });
  };

  const logIn = async (email: string, password: string) => {
    const formData = {
      email: email,
      password: password,
    };
    await axios
      .post("/api/v1/user/login/", formData)
      .then((res) => {
        if (res.status === 201) {
          error.value = null;
          user.value = {
            id: res.data.id,
            firstName: res.data.first_name,
            lastName: res.data.last_name,
            email: res.data.email,
          };
          saveUserToLocalStorage(user.value!);
        }
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 404) {
          error.value = "Неверная почта или пароль";
        } else {
          error.value = "Произошла неизвестная ошибка. Попробуйте еще раз";
        }
      });
  };

  const logOut = () => {
    axios
      .get("/api/v1/user/logout/")
      .then(() => {
        error.value = null;
        localStorage.removeItem("user");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { user, error, signUp, logIn, logOut };
});
