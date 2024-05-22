import * as Validator from "class-validator";

export class AddCommentDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 500)
    content: string;
}