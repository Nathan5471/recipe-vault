export function verifyIngredients(ingredients) {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return false;
    }
    for (const ingredient of ingredients) {
        if (typeof ingredient !== 'object' || !ingredient.name || !ingredient.quantity || !ingredient.unit) {
            return false;
        }
    }
    return true;
}

export function verifyInstructions(instructions) {
    if (!Array.isArray(instructions) || instructions.length === 0) {
        return false;
    }
    for (const instruction of instructions) {
        if (typeof instruction !== 'string' || instruction.trim() === '') {
            return false;
        }
    }
    return true;
}