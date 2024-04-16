export const MONTHS = {
    1: "janvier",
    2: "février",
    3: "mars",
    4: "avril",
    5: "mai",
    6: "juin",
    7: "juillet",
    8: "août",
    9: "septembre",
    10: "octobre",
    11: "novembre",
    12: "décembre",
};

// Nouvelle version de la fonction getMonth
// Elle renvoie le mois correspondant à l'index du tableau MONTHS
// On ajoute 1 à l'index car getMonth() renvoie un index basé sur 0 (0 pour janvier, 1 pour février, etc.)
export const getMonth = (date) => MONTHS[date.getMonth() + 1];
