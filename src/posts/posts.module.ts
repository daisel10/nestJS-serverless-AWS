import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { PostsService } from "./posts.service";
import { ResponseService } from "../common/helpers/response.service";
import { UUIDValidator } from "../common/middleware/uuid-validator";
import { LoggerHelper } from "../common/helpers/logging";
import { PostsController } from "./posts.controller";
import { PostsModel } from "../common/model/posts.model";
import { VerifyToken } from "../common/middleware/auth-validator";

@Module({
    providers: [ResponseService, LoggerHelper, PostsService, PostsModel],
    controllers: [PostsController],
})
export class PostsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UUIDValidator).forRoutes(PostsController);
        consumer.apply(VerifyToken).forRoutes(PostsController);
    }
}
