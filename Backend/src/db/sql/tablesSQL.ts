export const getConfessionsSQL = `
    SELECT * FROM confessions;
`;

export const postNewConfessionSQL = `
    INSERT INTO confessions 
    (confession, age, sex, category) 
    VALUES 
    ($1, $2, $3, $4);
`;
