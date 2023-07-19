import {reactive} from "vue";
import {useField} from "./field";
import { type Field } from "./signUpForm.js";

export interface Form {
    valid: boolean
}

interface formAnswer extends Form {
    answerText: Field
}

interface formQuestion extends Form{
    questionText: Field
}

export function useAnswerForm(init = {}): formAnswer {
    const form = reactive<formAnswer>(<formAnswer>{})

    for (const [key, val] of Object.entries(init)) {
        if (form) {
            form[key] = useField(val);
        }
    }

    return form
}

export function useQuestionForm(init = {}): formQuestion {
    const form = reactive<formQuestion>(<formQuestion>{})

    for (const [key, val] of Object.entries(init)) {
        if (form) {
            form[key] = useField(val);
        }
    }

    return form
}