import {reactive, ref, watch} from "vue";

export function useField(field) {
    const valid = ref(true)
    const value = ref(field.value)
    const touched = ref(false)
    const errors = reactive({})

    const reassign = () => {
        valid.value = true
        Object.keys(field.validators ?? {}).map(name => {
            const isValid = field.validators[name](value.value)
            errors[name] = !isValid
            if (!isValid)
                valid.value = false

        })
    }

    watch(value, reassign)
    reassign()

    return {value, valid, errors, validate: reassign, touched, blur: () => touched.value = true}
}