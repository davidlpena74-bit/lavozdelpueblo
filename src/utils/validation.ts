export const validateDNI = (dni: string): boolean => {
    // Basic format check: 8 digits + 1 letter (ignoring case/separators is good, but let's stick to standard format first)
    // Regex for 8 digits followed by a letter (case insensitive)
    const dniRegex = /^\d{8}[A-Za-z]$/;

    if (!dniRegex.test(dni)) {
        return false;
    }

    // Extract number and letter
    const number = parseInt(dni.substring(0, 8), 10);
    const letter = dni.substring(8, 9).toUpperCase();

    // Valid letters for DNI checksum
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // Calculate expected letter
    // The index is the remainder of the number divided by 23
    const expectedLetter = validLetters.charAt(number % 23);

    return letter === expectedLetter;
};
