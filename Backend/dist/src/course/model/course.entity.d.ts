import * as Orm from "typeorm";
import { User } from "../../user/model/user.entity";
import { Comment } from "../../comment/model/comment.entity";
import { Category } from "../../category/model/category.entity";
export declare class Course extends Orm.BaseEntity {
    readonly id: number;
    title: string;
    description: string;
    price: number;
    video: string;
    poster: string;
    sold: number;
    rating: number;
    discount: boolean;
    discountPercent: number;
    discountDeadline: number;
    active: boolean;
    saved: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    author: User;
    category: Category;
    comments: Comment[];
    customers: User[];
}
