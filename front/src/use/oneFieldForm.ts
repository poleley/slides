import {reactive} from "vue";
import {useField} from "./field";
import { Field } from "./form";

export interface Form {
    valid: boolean
}

interface formAnswer extends Form {
    answerText: Field
}

interface formQuestion extends Form{
    questionText: Field
}

export function useOneFieldForm(init = {}) {
    const form = reactive<formQuestion | formAnswer>(null)

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    return {form}
}