import { Injectable } from "@nestjs/common";
import { ResponseService } from "../common/helpers/response.service";
import { LoggerHelper } from "../common/helpers/logging";
import { AuthLogin, AuthRegister } from "./dto/auth.dto";
import { UserModel } from "../common/model/user.model";

const jwt = require("jsonwebtoken");

@Injectable()
export class AuthService {
    constructor(
        private readonly responseService: ResponseService,
        private readonly logger: LoggerHelper,
        private readonly userModel: UserModel
    ) {}

    async ping() {
        return this.responseService.success("Success ping with token", {
            response: [],
        });
    }

    async ping2() {
        return this.responseService.success("Success ping 2", { response: [] });
    }

    async register(bodyParams: AuthRegister) {
        try {
            const userData = await this.userModel.register(bodyParams);
            const token = jwt.sign(
                {
                    username: userData.username,
                    email: userData.email,
                    id: userData.id,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            return this.responseService.success(
                "User registered successfully",
                { response: [{ ...userData, token }] }
            );
        } catch (err) {
            console.error(err);
            return this.responseService.error(err.message, []);
        }
    }

    async login(bodyParams: AuthLogin) {
        try {
            const userData = await this.userModel.login(bodyParams);
            const token = jwt.sign(
                {
                    username: userData.username,
                    email: userData.email,
                    id: userData.id,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );
            return this.responseService.success("User logged successfully", {
                response: [{ ...userData, token }],
            });
        } catch (err) {
            console.error(err);
            return this.responseService.error(err.message, []);
        }
    }
}
