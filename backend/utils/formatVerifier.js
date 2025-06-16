export function verifyIngredients(ingredients) {
    const parsedIngredients = JSON.parse(ingredients);
    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
        return false;
    }
    for (const ingredient of parsedIngredients) {
        if (typeof ingredient !== 'object' || !ingredient.name || !ingredient.quantity || !ingredient.unit) {
            return false;
        }
    }
    return true;
}

export function verifyInstructions(instructions) {
    const parsedInstructions = JSON.parse(instructions);
    if (!Array.isArray(parsedInstructions) || parsedInstructions.length === 0) {
        return false;
    }
    for (const instruction of parsedInstructions) {
        if (typeof instruction !== 'string' || instruction.trim() === '') {
            return false;
        }
    }
    return true;
}