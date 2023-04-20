import {reactive, watch} from "vue";
import {useField} from "@/use/field";

export function useForm(init = {}, config = {}) {
    const form = reactive({})
    const {validators} = config

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    // watch(Object.values(form).map(val => () => val.value), () => {
    //     validators.forEach((validator) => {validator(form)})
    // })

    watch([
        () => form.password.value,
        () => form.passwordConfirm.value
    ], () => {
        validators.forEach((validator) => {validator(form)})
    })

    return {form}
}