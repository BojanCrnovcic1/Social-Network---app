import * as Validator from "class-validator";

export class EditCommentDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 500)
    newContent: string;
}