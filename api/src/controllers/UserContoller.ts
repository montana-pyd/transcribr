import { Router, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import uuid4 from 'uuid/v4';
import Joi from 'joi';
import UserStore from '../stores/UserStore';
import IUser from '../interfaces/IUser';
// import { JWT_SECRET, ADMIN_UI_BASE_URL } from './../env';

export default class UserController {
  public path = '/user';
  public router = Router();
  private storage = new UserStore();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post('/register', this.register);
    // this.router.post('/login', this.login);
  }
  
  public register = async (request: Request, response: Response) => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
    });

    const params = Joi.validate(request.body, schema);
    const { email, password, firstName, lastName, phoneNumber } = params.value;

    if (params.error) {
      console.error(params.error);
      return response.status(400).json(params.error);
    }

  /**
   * Make sure that there isn't an existing account
   * associated with this email address
   */

    let existingUser: IUser;
    try {
      existingUser = await this.storage.findByEmail(email);

      if (existingUser && existingUser.email) {
        throw new Error('An account with email already exists.');
      }

    } catch (e) {
      console.error(e);
      return response.status(400).json(e);
    }

    /**
   * Save the user to storage
   */

    const attributes: IUser = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      createdAt: Date.now(),
    };

    let user: IUser;
    try {
      user = await this.storage.createUser(attributes);
      return response.status(200).json(user);
    } catch (e) {
      console.error(e);
      return response.status(400).json(e);
    }

  }

}

// class UserService extends BaseService {

//   public proxy: IServiceProxy;

//   constructor(opts) {
//     super(opts);
//   }
  
//   private generateJWT = (user: IUser): string => {
//     return jwt.sign({ _id: user._id, email: user.email, orgId: user.orgContextId }, JWT_SECRET);
//   }
//   public createUser = async (request: pb.CreateUserRequest): Promise<pb.CreateUserResponse> => {
//     const span = tracer.startSpan('createUser', request.spanContext);
//     const response: pb.CreateUserResponse = pb.CreateUserResponse.create();

//     /**
//      * Validate the registration parameters
//      */
//     const schema = Joi.object().keys({
//       email: Joi.string().email().required(),
//       password: Joi.any().allow(null).optional(),
//       firstName: Joi.any().allow(null).optional(),
//       lastName: Joi.any().allow(null).optional(),
//       phoneNumber: Joi.any().allow(null).optional(),
//     });

//     const params = Joi.validate(request.user, schema);
//     const  { email, password, firstName, lastName, phoneNumber } = params.value;

//     if (params.error) {
//       this.logger.error(`createUser - error: ${JSON.stringify(params.error)}`);
//       response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
//       response.errors = joiToErrors(params.error, pb.Error);
//       span.setTag('error', true);
//       span.log({ errors: params.error });
//       span.finish();
//       return response;
//     }

//     /**
//      * Make sure that there isn't an existing account
//      * associated with this email address
//      * MUST have a password to fail, otherwise
//      * the user is adding a password
//      */
//     let existingUser: IUser;
//     try { 
//       existingUser = await this.storage.findByEmail(span, email);
//       if(existingUser && existingUser.passwordHash) {
//         throw new Error('An account with email already exists.');
//       }
//     } catch(e) {
//       this.logger.error(`createUser - error: ${e}`);
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message,
//         })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

    
//     /**
//      * Save the user to storage
//      */

//     const attributes: IUser = {
//       email,
//       password,
//       firstName,
//       lastName,
//       phoneNumber,
//       createdAt: Time.now(),
//     };

//     let user: IUser;
//     try {
//       user = await this.storage.createUser(span, attributes, !!existingUser);
//       response.status = pb.StatusCode.OK;
//       response.user = this.toPb(user);
//     } catch(e) {
//       this.logger.error(`createUser - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [
//         pb.Error.create({
//           key: 'Error',
//           message: 'Register was unsuccessful. Please try again.',
//         }),
//       ];
//       span.setTag('error', true);
//       span.log({ errors: e })
//       span.finish();
//       return response;
//     }
    
//     if(password) {
//       /**
//       * The User Profile is created during registration
//       * The follow code creates this profile
//       */
//       const createProfileRequest = new pb.CreateUserProfileRequest({
//         spanContext: span.context().toString(),
//         userId: user._id.toString()
//       });

//       let createProfileResponse: pb.CreateUserProfileResponse;

//       try {
//         createProfileResponse = await this.proxy.userProfileService.createUserProfile(createProfileRequest);

//         if (createProfileResponse.status !== pb.StatusCode.OK) {
//           throw new Error('There was an error creating the user profile. Please contact support.');
//         }

//       } catch (e) {
//         this.logger.error(`createUser - error: ${e}`);
//         response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//         response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message
//         })];
//         span.setTag('error', true);
//         span.log({ errors: e });
//         span.finish();
//         return response;
//       }

//       /**
//       * To verify the users email, we email them a one-time
//       * verification code in a welcome email
//       */
//       const sendEmailCodeRequest = pb.SendUserEmailVerificationRequest.create({
//         spanContext: span.context().toString(),
//         userId: user._id,
//       });

//       try {
//         await this.sendUserEmailVerification(sendEmailCodeRequest);
//       } catch(e) {
//         console.error(e);
//       }


//     }

//     if (phoneNumber) {
//       /**
//        * During registration, we register the user with Twilio
//        * so that we can verify their phone number during
//        * onboarding and send them messages later
//        *
//        */
//       const registerTwilioUserRequest = pb.RegisterTwilioUserRequest.create({
//         spanContext: span.context().toString(),
//         email,
//         phoneNumber,
//         countryCode: 'US',
//       });

//       let registerTwilioUserResponse: pb.RegisterTwilioUserResponse;

//       try {
//         registerTwilioUserResponse = await this.proxy.twilioService.registerTwilioUser(registerTwilioUserRequest);

//         if (registerTwilioUserResponse.status !== pb.StatusCode.OK) {
//           throw new Error("There was an error validating your phone number. Please contact support.");
//         }

//       } catch (e) {
//         this.logger.error(`createUser - error: ${e}`);
//         response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//         response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message
//         })];
//         span.setTag('error', true);
//         span.log({ errors: e });
//         span.finish();
//         return response;
//       }

//       const updateUserProfileRequest = pb.UpdateUserProfileRequest.create({
//         spanContext: span.context().toString(),
//         userId: user._id.toString(),
//         userProfile: {
//           authyId: registerTwilioUserResponse.authyId,
//         },
//       });

//       try {
//         await this.proxy.userProfileService.updateUserProfile(updateUserProfileRequest);
//       } catch (e) {
//         this.logger.error(`createUser - error: ${e}`);
//         response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//         response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message
//         })];
//         span.setTag('error', true);
//         span.log({ errors: e });
//         span.finish();
//         return response;
//       }
//     }
  
//     span.finish();
//     return response;
//   }
//   public sendUserEmailVerification = async (request: pb.SendUserEmailVerificationRequest): Promise<pb.SendUserEmailVerificationResponse> => {
//     const span = tracer.startSpan('sendUserEmailVerification', request.spanContext);
//     const response: pb.SendUserEmailVerificationResponse = pb.SendUserEmailVerificationResponse.create();

//     const schema = Joi.object().keys({
//       spanContext: Joi.string(),
//       userId: Joi.string().required()
//     });

//     const params = Joi.validate(request, schema);
//     const { userId } = params.value;

//     const emailVerifyCode: string =  uuid4();

//     try {
//       await this.storage.saveEmailVerifyCode(span, userId, emailVerifyCode);
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [
//         pb.Error.create({
//           key: "Error",
//           message: e.message
//         })
//       ];
//       span.setTag("error", true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }


//     let user: IUser;

//     try {
//       user = await this.storage.findById(span, userId);
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     const { firstName, lastName, email } = user;

//     const welcomeEmailRequest = pb.QueueUserWelcomeEmailRequest.create({
//       spanContext: span.context().toString(),
//       toAddress: email,
//       firstName,
//       lastName,
//       verificationUrl: `${ADMIN_UI_BASE_URL}/verify-email?code=${emailVerifyCode}`,
//     });

//     try {
//       await this.proxy.emailService.queueUserWelcomeEmail(welcomeEmailRequest);
//       response.status = pb.StatusCode.OK;
//     } catch(e) {
//       this.logger.error(e);
//     }

//     span.finish();
//     return response;
//   }
//   public sendUserPhoneVerification = async (request: pb.VerifyUserEmailRequest): Promise<pb.VerifyUserEmailResponse> => {
//     const span = tracer.startSpan('sendUserPhoneVerification', request.spanContext);
//     const response: pb.SendUserPhoneVerificationResponse = pb.SendUserPhoneVerificationResponse.create();

//     const schema = Joi.object().keys({
//       spanContext: Joi.string(),
//       userId: Joi.string().required(),
//     });

//     const params = Joi.validate(request, schema);
//     const { userId } = params.value;

//     if (params.error) {
//       this.logger.error(`sendUserPhoneVerification - error: ${JSON.stringify(params.error)}`);
//       response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
//       response.errors = joiToErrors(params.error, pb.Error);
//       span.setTag('error', true);
//       span.log({ errors: params.error });
//       span.finish();
//       return response;
//     }

//     let user: IUser;
//     try {
//       user = await this.storage.findById(span, userId);
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     let verifyRequest = pb.SendTwilioVerificationRequest.create({
//       spanContext: span.context().toString(),
//       phoneNumber: user.phoneNumber,
//       countryCode: 'US',
//       locale: 'en',
//     }); 

//     try {
//       await this.proxy.twilioService.sendTwilioVerification(verifyRequest);
//       response.status = pb.StatusCode.OK;
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     span.finish();
//     return response;
//   }
//   public verifyUserPhoneNumber = async (request: pb.VerifyUserPhoneNumberRequest): Promise<pb.VerifyUserPhoneNumberResponse> => {
//     const span = tracer.startSpan('verifyUserPhoneNumber', request.spanContext);
//     const response: pb.VerifyUserPhoneNumberResponse = pb.VerifyUserPhoneNumberResponse.create();

//     const schema = Joi.object().keys({
//       spanContext: Joi.string(),
//       userId: Joi.string().required(),
//       phoneVerificationToken: Joi.string().required(),
//     });

//     const params = Joi.validate(request, schema);
//     const { userId, phoneVerificationToken } = params.value;

//     if (params.error) {
//       this.logger.error(`verifyUserPhoneNumber - error: ${JSON.stringify(params.error)}`);
//       response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
//       response.errors = joiToErrors(params.error, pb.Error);
//       span.setTag('error', true);
//       span.log({ errors: params.error });
//       span.finish();
//       return response;
//     }

//     let user: IUser;
//     try {
//       user = await this.storage.findById(span,userId);
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }


//     const verifyTokenRequest = pb.VerifyTwilioTokenRequest.create({
//       spanContext: span.context().toString(),
//       phoneNumber: user.phoneNumber,
//       token: phoneVerificationToken,
//       countryCode: 'US',
//       locale: 'en-us',
//     });

//     let verifyTokenResponse: pb.VerifyTwilioTokenResponse;

//     try {
//       verifyTokenResponse = await this.proxy.twilioService.verifyTwilioToken(verifyTokenRequest);

//       if (verifyTokenResponse.status !== pb.StatusCode.OK) {
//         response.status = verifyTokenResponse.status;
//         response.errors = verifyTokenResponse.errors;
//         span.finish();
//         return response;
//       }

//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     try {
//       this.storage.verifyPhoneNumber(span, userId);
//     } catch(e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//           key: "Error",
//           message: e.message
//         })];
//       span.setTag("error", true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     response.status = pb.StatusCode.OK;
//     response.phoneVerified = verifyTokenResponse.phoneVerified;

//     span.finish();
//     return response;
//   }
//   public verifyUserEmail = async(request: pb.VerifyUserEmailRequest): Promise<pb.VerifyUserEmailResponse> => {
//     const span = tracer.startSpan('verifyUserEmail', request.spanContext);
//     const response: pb.VerifyUserEmailResponse = pb.VerifyUserEmailResponse.create();

//     const schema = Joi.object().keys({
//       emailVerifyCode: Joi.string().required(),
//       spanContext: Joi.string(),
//     });

//     const params = Joi.validate(request, schema);
//     const { emailVerifyCode } = params.value;

//     if (params.error) {
//       this.logger.error(`verifyUserEmail - error: ${JSON.stringify(params.error)}`);
//       response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
//       response.errors = joiToErrors(params.error, pb.Error);
//       span.setTag('error', true);
//       span.log({ errors: params.error });
//       span.finish();
//       return response;
//     }

//     let user: IUser;
//     try {
//       user = await this.storage.findBy(span, { emailVerifyCode });   
//       if(user && user.emailVerifiedAt) {
//         throw new Error('This account has already been verified.');
//       }
//     } catch (e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     let isValid;
//     try {
//       isValid = await this.storage.verifyEmail(span, emailVerifyCode);
//       if (!isValid) {
//         throw new Error('Invalid verification code.');
//       }
//       response.status = pb.StatusCode.OK;
//       response.emailVerified = true;
//     } catch(e) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.emailVerified = false;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     /**
//     * Once a user has verified their email
//     * we update the organization roles that
//     * they have authorization to access with
//     * their userId
//     */

//     const updateRolesRequest = pb.AssignUserIdToRolesRequest.create({
//       spanContext: span.context().toString(),
//       userId: user._id.toString(),
//       userEmail: user.email,
//     });

//     try {
//       await this.proxy.roleService.assignUserIdToRoles(updateRolesRequest);
//     } catch(e) {
//       this.logger.error(`assignUserIdToRoles - error: ${e}`);
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//     }

//     span.finish();
//     return response;
//   }
//   public setUserOrgContextId = async (request: pb.SetUserOrgContextIdRequest): Promise<pb.SetUserOrgContextIdResponse> => {
//     const span = tracer.startSpan('authUser', request.spanContext);
//     const response: pb.SetUserOrgContextIdResponse = pb.SetUserOrgContextIdResponse.create();

//     const schema = Joi.object().keys({
//       spanContext: Joi.string(),
//       userId: Joi.string().required(),
//       orgId: Joi.any(),
//     });

//     const params = Joi.validate(request, schema);
//     const { userId, orgId } = params.value;

//     if (params.error) {
//       this.logger.error(`setUserOrgContextId - error: ${JSON.stringify(params.error)}`);
//       response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
//       response.errors = joiToErrors(params.error, pb.Error);
//       span.setTag('error', true);
//       span.log({ errors: params.error });
//       span.finish();
//       return response;
//     }

//     let role;

//     if(orgId) {
//       const findUserRoleRequest = pb.FindUserRoleRequest.create({
//         spanContext: span.context().toString(),
//         userId,
//         orgId
//       });

//       let findUserRoleResponse: pb.FindUserRoleRequest;

//       try {
//         findUserRoleResponse = await this.proxy.roleService.findUserRole(findUserRoleRequest);
//         role = findUserRoleResponse.role;

//         if(!role) {
//           throw new Error('This user does not have access to this organization.');
//         }

//       } catch(e) {
//         this.logger.error(`setUserOrgContextId - error: ${e}`);
//         response.status = pb.StatusCode.UNAUTHORIZED;
//         response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message,
//         })];
//         span.setTag('error', true);
//         span.log({ errors: e });
//         span.finish();
//         return response;
//       }
//     }

//     let user: IUser;

//     try {
//       user = await this.storage.setUserOrgContextId(span, userId, orgId);
//     } catch (e) {
//       this.logger.error(`setUserOrgContextId - error: ${e}`);
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }
  
//     response.user = this.toPb(user);
//     response.token = this.generateJWT(user);
//     response.status = pb.StatusCode.OK;

//     span.finish();
//     return response;
//   }
//   public authUser = async (request: pb.AuthUserRequest): Promise<pb.AuthUserResponse> => {
//     const span = tracer.startSpan('authUser', request.spanContext);
//     const response: pb.AuthUserResponse = pb.AuthUserResponse.create();

//     let user: IUser;
//     let isValidPassword = false;

//     try {
//       user = await this.storage.findByEmail(span, request.email);
//       if (!user) {
//         throw new Error('An account with this email does not exist.');
//       }
//     } catch (e) {
//       this.logger.error(`authUser - error: ${e}`);
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message,
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     try {
//       isValidPassword = await this.storage.comparePasswordHash(span, request.password, user.passwordHash);  
//     } catch(e) {
//       this.logger.error(`authUser - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message
//         })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     let error;
//     if(!isValidPassword) {
//       error = 'Invalid email or password.';
//       this.logger.error(`authUser - error: ${error}`);
//       response.status = pb.StatusCode.UNAUTHORIZED;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: error
//       })];
//       span.setTag('error', true);
//       span.log({ errors: error });
//       span.finish();
//       return response;
//     }
    

//     /**
//     * Get organization information
//     */

//     let organization;

//     const findOrgRequest = pb.FindOrganizationRequest.create({
//       spanContext: span.context().toString(),
//       orgId: user.orgContextId,
//     });

//     try {
//       organization = await this.proxy.organizationService.findOrganization(findOrgRequest);
//     } catch(e) {
//       console.error(e);
//     }

//     console.log(organization);

//     // if (!user.emailVerifiedAt) {
//     //   error = 'The email address associated with this account has not been verfied.';
//     //   this.logger.error(`authUser - error: ${error}`);
//     //   response.status = pb.StatusCode.UNAUTHORIZED;
//     //   response.errors = [pb.Error.create({
//     //     key: 'Error',
//     //     message: error
//     //   })];
//     //   span.setTag('error', true);
//     //   span.log({ errors: error });
//     //   span.finish();
//     //   return response;
//     // }

//     response.token = this.generateJWT(user);
//     response.user = this.toPb(user);
//     response.status = pb.StatusCode.OK;

//     span.finish();
//     return response;
//   }
//   public forgotUserPassword = async (request: pb.ForgotPasswordUserRequest): Promise<pb.ForgotPasswordUserResponse> => {
//     const span = tracer.startSpan('forgotUserPassword', request.spanContext);
//     const response: pb.ForgotUserPassword = pb.ForgotUserPasswordRequest.create();

//     const schema = Joi.object().keys({
//       email: Joi.string().email().required(), 
//       spanContext: Joi.string(),
//     });

//     const params = Joi.validate(request, schema);
//     const { email } = params.value;

//     // Generate code for reset password email
//     const forgotPasswordCode: string = uuid4();

//     let saveCodeSuccess = false;
//     try {
//       saveCodeSuccess = await this.storage.forgotPassword(span, email, forgotPasswordCode);
//       response.status = pb.StatusCode.OK;  
//     } catch (e) {
//       this.logger.error(`forgotUserPassword - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//     }

//     if(saveCodeSuccess) {  
//       const resetPasswordEmailRequest = new pb.QueueUserResetPasswordEmailRequest.create({
//         spanContext: span.context().toString(),
//         toAddress: email,
//         resetPasswordUrl: `${ADMIN_UI_BASE_URL}/reset-password?code=${forgotPasswordCode}`,
//       });

//       try {
//         await this.proxy.emailService.queueUserResetPasswordEmail(resetPasswordEmailRequest);
//       } catch (e) {
//         this.logger.error(e);
//       }
//     }
    
//     span.finish();
//     return response;
//   }
//   public resetUserPassword = async (request: pb.ResetPasswordUserRequest): Promise<pb.ResetPasswordUserResponse> => {
//     const span = tracer.startSpan('resetUserPassword', request.spanContext);
//     const response: pb.ResetUserPasswordResponse = pb.ResetUserPasswordResponse.create();

//     const schema = Joi.object().keys({
//       spanContext: Joi.string(),
//       forgotPasswordCode: Joi.string().required(),
//       password: Joi.string().required(),
//     });

//     const params = Joi.validate(request, schema);
//     const { forgotPasswordCode, password } = params.value;

//     let isReset = false;
//     try {
//       isReset = await this.storage.resetPassword(span, forgotPasswordCode, password);
//       response.status = pb.StatusCode.OK;
//     } catch(e) {
//       this.logger.error(`resetUserPassword - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [pb.Error.create({
//           key: 'Error',
//           message: e.message,
//         })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//       return response;
//     }

//     if (!isReset) {
//       response.status = pb.StatusCode.BAD_REQUEST;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: 'Invalid password reset code. Please try again or contact support.',
//       })];
//     }

//     return response;
//   }
//   public findUserById = async (request: pb.FindUserByIdRequest): Promise<pb.FindUserByIdResponse> => {
//     const span = tracer.startSpan('findUserById', request.spanContext);
//     const response: pb.FindUserByIdResponse = pb.FindUserByIdResponse.create();

//     let user: IUser;
//     try {
//       user = await this.storage.findById(span, request.userId);
//       response.status = pb.StatusCode.OK;
//       response.user = this.toPb(user);
//     } catch(e) {
//       this.logger.error(`findUserById - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//     }

//     span.finish();
//     return response;
//   }
//   public findUserByEmail = async (request: pb.FindUserByEmailRequest): Promise<pb.FindUserByEmailResponse> => {
//     const span = tracer.startSpan('findUserByEmail', request.spanContext);
//     const response: pb.FindUserByEmailResponse = pb.FindUserByEmailResponse.create();

//     let user: IUser;
//     try {
//       user = await this.storage.findByEmail(span, request.email);
//       response.status = pb.StatusCode.OK;
//       response.user = this.toPb(user);
//     } catch (e) {
//       this.logger.error(`findUserByEmail - error: ${e}`);
//       response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
//       response.errors = [pb.Error.create({
//         key: 'Error',
//         message: e.message
//       })];
//       span.setTag('error', true);
//       span.log({ errors: e });
//       span.finish();
//     }

//     span.finish();
//     return response;
//   }
  
// }
