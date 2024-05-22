import * as Validator from "class-validator";

export class RegisterUserDto {
    @Validator.IsNotEmpty()
    @Validator.IsEmail({
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true
    })
    email: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 12)
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 255)
    username: string;

    @Validator.IsString()
    @Validator.Length(0, 1500)
    bio: string;
    
    profilePhoto: string | null;

    coverPhoto: string | null;
}