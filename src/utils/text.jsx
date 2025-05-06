export const capitalizeWords = (sentence) => {
    if (typeof sentence !== "string") return "";
    return sentence
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
