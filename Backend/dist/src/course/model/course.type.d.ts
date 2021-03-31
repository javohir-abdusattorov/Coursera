import { UserType } from "../../user/model/user.type";
import { CategoryType } from "../../category/model/category.type";
import { CommentType } from "../../comment/model/comment.type";
export declare class CourseType {
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
    author: UserType;
    category: CategoryType;
    comments: CommentType[];
    customers: UserType[];
}
