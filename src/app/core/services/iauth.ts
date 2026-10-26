import { Observable } from "rxjs"
import { RegisterRequest } from "../../models/register-request"
import { RegisterResponse } from "../../models/register-reponse"
import { LoginRequest } from "../../models/login-request"
import { LoginResponse } from "../../models/login-response"

export interface IAuthService {
  register(request: RegisterRequest): Observable<RegisterResponse>
  login(request: LoginRequest): Observable<LoginResponse>
  refresh(): Observable<LoginResponse>
}
