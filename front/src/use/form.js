import {computed, reactive, watch} from "vue";
import {useField} from "@/use/field";

export function useForm(init = {}, config = {}, isLogin = false) {
    const form = reactive({})
    const {validators} = config

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    let args = [];
    if (isLogin) {
        args = []
    } else
        args = [() => form.password.value, () => form.passwordConfirm.value]
    watch(args, () => {
        validators.forEach((validator) => {
            validator(form)
        })
    })

    form.valid = computed(() => {
        return Object.keys(form).filter(k => k !== "valid").reduce((acc, key) => {
            acc = form[key].valid
            return acc
        }, true)
    })

    return {formQuestion: form}
}