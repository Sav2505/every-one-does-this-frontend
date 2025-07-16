export interface IConfession {
  id: number;
  confession: string;
  age: number;
  sex: "male" | "female";
  category: ECATEGORIES;
  created_at: Date;
}

export type IPostConfession = Pick<IConfession, "confession" | "age" | "sex" | "category">;

export enum ECATEGORIES {
  FOOD = "אוכל",
  COLTURE = "תרבות",
  HEALTH = "בריאות",
  CONSUMPTION = "צרכנות",
  SPORT = "ספורט",
  NEWS = "חדשות",
  DIGITAL = "דיגיטל",
  RELATIONS = "יחסים",
  LIFESTYLE = "אורח חיים",
  WEATHER = "מזג אוויר",
}

export enum EDISPLAYES {
  TIME = "time",
  AGE = "age",
  GENDER = "gender",
}