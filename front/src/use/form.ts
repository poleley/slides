import { computed, reactive, watch } from "vue";
import { useField } from "./field";

export interface Form1 {
    firstName: Field,
    lastName: Field,
    valid: boolean,
    username: Field,
    email: Field,
    password: Field,
    passwordConfirm: Field,
}

export interface Form2 {
    email: Field,
    password: Field,
    valid: boolean
}

export interface Field {
    value: string,
    valid: boolean,
    touched: boolean,
    blur: boolean,
    errors: object
}

export function useForm(init = {}, config = {}, isLogin = false): Form1 | Form2 {
    const form = reactive<Form1 | Form2>(<Form1 | Form2>{
        valid: computed(() => {
            return Object.keys(form).filter(k => k !== "valid").reduce((acc, key) => {
                acc = form[key].valid
                return acc
            }, true)
        })
    })
    const {validators} = config

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    let args = [];
    if (isLogin) {
        args = []
    } else
        args = [() => form['password'].value, () => form['passwordConfirm'].value]
    watch(args, () => {
        validators.forEach((validator) => {
            validator(form)
        })
    })

    return form
}