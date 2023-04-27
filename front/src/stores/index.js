import {defineStore} from 'pinia';
import {ref} from "vue";
import axios from "axios";

export const useUserStore = defineStore('userStore', () => {
    const user = ref(null)

    if (localStorage.getItem('user')) {
        try {
            user.value = JSON.parse(localStorage.getItem('user') || null);
        } catch (e) {
            console.log(e)
            localStorage.removeItem('user');
        }
    }

    const saveUserToLocalStorage = (user) => {
        const parsed = JSON.stringify(user);
        localStorage.setItem('user', parsed);
    }

    const signUp = async (email, password, firstName, lastName) => {
        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
        }
        const res = await axios.post("/api/v1/user/signup/", formData)
            .then((res) => {
                if (res.status === 201) {
                    user.value = {
                        id: res.data.id,
                        firstName: res.data.first_name,
                        lastName: res.data.last_name,
                        email: res.data.email,
                    }
                    saveUserToLocalStorage(user.value)
                }
            }
        ).catch((err) => {
            console.log(err)
        })
    }

    const logIn = async (email, password) => {
        const formData = {
            email: email,
            password: password
        }
        const res = await axios.post("/api/v1/user/login/", formData)
            .then((res) => {
                if (res.status === 201) {
                    user.value = {
                        id: res.data.id,
                        firstName: res.data.first_name,
                        lastName: res.data.last_name,
                        email: res.data.email,
                    }
                    saveUserToLocalStorage(user.value)
                }
            }
        ).catch((err) => {
            console.log(err)
        })
    }

    const logOut = () => {
        const res = axios.get("/api/v1/user/logout/")
            .then((res) => {
                user.value = null
                saveUserToLocalStorage(user.value)
            }
        ).catch((err) => {
            console.log(err)
        })
    }

    return {user, signUp, logIn, logOut}
});