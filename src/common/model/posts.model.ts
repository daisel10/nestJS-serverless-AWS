import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
    DeleteItemCommand,
    UpdateItemCommand,
    GetItemCommand,
    
} from "@aws-sdk/client-dynamodb";
import { PostsCreate, PostsId, PostsUpdate } from "src/posts/dto/posts.dto";
import { v4 as uuidv4 } from 'uuid';


export class PostsModel {
    public dynamoClient: DynamoDBClient;

    constructor() {
        this.dynamoClient = new DynamoDBClient({ region: "us-east-1" });
    }
    async posts(){
        const input = {
            TableName: "api-backend-kk-posts",
            Key:{"id":{
                "S":"*"
            },}
          };
          const command = new GetItemCommand(input);
          const response = await this.dynamoClient.send(command);

          return response; 

    }

    async createPosts(bodyParams:PostsCreate){
        const productId = uuidv4();
        const putCommand = new PutItemCommand({
            TableName: "api-backend-kk-posts",
            Item: {
                id: { S: productId },
                name: { S: bodyParams.name },
                createdAt: { S: bodyParams.createAt },
                sale: { S: `${bodyParams.sale}` },
                price: { S: `${bodyParams.price}` },
                photo: { S: bodyParams.photo },
            },
        });
        await this.dynamoClient.send(putCommand);
        return
    }

    async findPosts(id:PostsId){
        console.log("🚀 ~ file: pruducts.model.ts:42 ~ PostsModel ~ findPosts ~ id:", id)
        
        const findCommand = new ScanCommand({
            TableName: "api-backend-kk-posts",
            FilterExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": { S: `${id}` },
            },
        });

        const productId = await this.dynamoClient.send(findCommand);
        console.log("🚀 ~ file: pruducts.model.ts:51 ~ PostsModel ~ findPosts ~ productId:", productId)
        
        return productId.Items
    }

    async updatePosts(bodyParams:PostsUpdate){

        // const update = {
        //     ExpressionAttributeNames:{
        //         "#name": `${bodyParams.name}` ,
        //         "#sale": `${bodyParams.sale}`,
        //         "#price":`${bodyParams.price}`,
        //         "#photo": `${bodyParams.photo}`,
        //     },
        //     ExpressionAttributeValues:{
        //         "name": { "S": ":name" },
        //         "sale": { "S":":sale" },
        //         "price": { "S":":price" },
        //         "photo": { "S": ":photo" },
        //     },
        //     Key:{
        //         "id":{
        //             "S":`${bodyParams.id}`
        //         },
               

        //     },
        //     ReturnValues: "ALL_NEW",
        //     TableName: "api-backend-kk-posts",
        //     UpdateExpression: "SET #name = :name, #sale = :sale, #price = :price, #photo = :photo "
        //     };
            const update = {
                TableName: "api-backend-kk-posts",
                Key:{
                    "id":{
                        "S":`${bodyParams.id}`
                    },
                   
    
                },
                AttributeUpdates :{
                    "Genre":{
                        "Action": "PUT", 
                        "name": { "S": `${bodyParams.name}` },
                        "sale": { "S":`${bodyParams.sale}` },
                        "price": { "S":`${bodyParams.price}` },
                        "photo": { "S": `${bodyParams.photo}` },
                    },
                }
                };
           
        
        const command = new UpdateItemCommand(update);
        await this.dynamoClient.send(command);
       
       

    }

    async deletedPosts(id:PostsId){

       const deleteCommand = new DeleteItemCommand({
        TableName: "api-backend-kk-posts",
        Key:{"id":{
            "S":`${id}`
        },}
       });

        
       await this.dynamoClient.send(deleteCommand);
    }

    
}
