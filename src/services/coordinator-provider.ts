import { TokenPayload, IUserSession } from "../services/models";
import {Coordinator} from "./coordinator"

type CoordinatorFactory = (userSession:IUserSession) => Coordinator;

export class CoordinatorProvider {
    private coordinator : CoordinatorFactory | null = null;

    inject(coordinator: CoordinatorFactory)
    {
        this.coordinator = coordinator; 
    }

    create(user:IUserSession): Coordinator {
        return this.coordinator!(user)
    } 
}