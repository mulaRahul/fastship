/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_login_delivery_partner */
export interface BodyLoginDeliveryPartner {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /** Client Secret */
  client_secret?: string | null;
}

/** Body_login_seller */
export interface BodyLoginSeller {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /** Client Secret */
  client_secret?: string | null;
}

/** Body_reset_password */
export interface BodyResetPassword {
  /** Password */
  password: string;
}

/** DeliveryPartnerCreate */
export interface DeliveryPartnerCreate {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Max Handling Capacity */
  max_handling_capacity: number;
  /** Password */
  password: string;
}

/** DeliveryPartnerRead */
export interface DeliveryPartnerRead {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Max Handling Capacity */
  max_handling_capacity: number;
}

/** DeliveryPartnerUpdate */
export interface DeliveryPartnerUpdate {
  /** Max Handling Capacity */
  max_handling_capacity?: number | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** SellerCreate */
export interface SellerCreate {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
  /** Address */
  address: string;
  /** Zip Code */
  zip_code: number;
}

/** SellerRead */
export interface SellerRead {
  /** Name */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
}

/**
 * ShipmentCreate
 * Shipment details to create a new shipment
 */
export interface ShipmentCreate {
  /**
   * Content
   * @maxLength 100
   */
  content: string;
  /**
   * Weight
   * @max 25
   */
  weight: number;
  /**
   * Destination
   * location zipcode
   */
  destination: number;
  /**
   * Client Contact Email
   * @format email
   */
  client_contact_email: string;
  /** Client Contact Phone */
  client_contact_phone?: string | null;
}

/** ShipmentEvent */
export interface ShipmentEvent {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Location */
  location: number;
  status: ShipmentStatus;
  /** Description */
  description?: string | null;
  /**
   * Shipment Id
   * @format uuid
   */
  shipment_id: string;
}

/** Shipment */
export interface Shipment {
  /**
   * Content
   * @maxLength 100
   */
  content: string;
  /**
   * Weight
   * @max 25
   */
  weight: number;
  /**
   * Destination
   * location zipcode
   */
  destination: number;
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Timeline */
  timeline: ShipmentEvent[];
  /**
   * Estimated Delivery
   * @format date-time
   */
  estimated_delivery: string;
  /** Tags */
  tags: TagRead[];
}

/** ShipmentStatus */
export enum ShipmentStatus {
  Placed = "placed",
  InTransit = "in_transit",
  OutForDelivery = "out_for_delivery",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

/** ShipmentUpdate */
export interface ShipmentUpdate {
  /** Location */
  location?: number | null;
  status?: ShipmentStatus | null;
  /** Verification Code */
  verification_code?: string | null;
  /** Description */
  description?: string | null;
  /** Estimated Delivery */
  estimated_delivery?: string | null;
}

/** TagName */
export enum TagName {
  Express = "express",
  Standard = "standard",
  Fragile = "fragile",
  Heavy = "heavy",
  International = "international",
  Domestic = "domestic",
  TemperatureControlled = "temperature_controlled",
  Gift = "gift",
  Return = "return",
  Documents = "documents",
}

/** TagRead */
export interface TagRead {
  name: TagName;
  /** Instruction */
  instruction: string;
}

/** TokenData */
export interface TokenData {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title FastShip
 * @version 0.1.0
 *
 *
 * Delivery Management System for sellers and delivery agents
 *
 * ### Seller
 * - Submit shipment effortlessly
 * - Share tracking links with customers
 *
 * ### Delivery Agent
 * - Auto accept shipments
 * - Track and update shipment status
 * - Email and SMS notifications
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  shipment = {
    /**
     * No description
     *
     * @tags Shipment
     * @name GetShipment
     * @summary Get Shipment
     * @request GET:/shipment/
     */
    getShipment: (
      query: {
        /**
         * Id
         * @format uuid
         */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Shipment, HTTPValidationError>({
        path: `/shipment/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shipment
     * @name SubmitShipment
     * @summary Submit Shipment
     * @request POST:/shipment/
     * @secure
     */
    submitShipment: (data: ShipmentCreate, params: RequestParams = {}) =>
      this.request<Shipment, HTTPValidationError>({
        path: `/shipment/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shipment
     * @name UpdateShipment
     * @summary Update Shipment
     * @request PATCH:/shipment/
     * @secure
     */
    updateShipment: (
      query: {
        /**
         * Id
         * @format uuid
         */
        id: string;
      },
      data: ShipmentUpdate,
      params: RequestParams = {},
    ) =>
      this.request<Shipment, HTTPValidationError>({
        path: `/shipment/`,
        method: "PATCH",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shipment
     * @name AddTagToShipment
     * @summary Add Tag To Shipment
     * @request GET:/shipment/tag
     */
    addTagToShipment: (
      query: {
        /**
         * Id
         * @format uuid
         */
        id: string;
        tag_name: TagName;
      },
      params: RequestParams = {},
    ) =>
      this.request<Shipment, HTTPValidationError>({
        path: `/shipment/tag`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shipment
     * @name RemoveTagFromShipment
     * @summary Remove Tag From Shipment
     * @request DELETE:/shipment/tag
     */
    removeTagFromShipment: (
      query: {
        /**
         * Id
         * @format uuid
         */
        id: string;
        tag_name: TagName;
      },
      params: RequestParams = {},
    ) =>
      this.request<Shipment, HTTPValidationError>({
        path: `/shipment/tag`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shipment
     * @name CancelShipment
     * @summary Cancel Shipment
     * @request GET:/shipment/cancel
     * @secure
     */
    cancelShipment: (
      query: {
        /**
         * Id
         * @format uuid
         */
        id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/shipment/cancel`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  seller = {
    /**
     * No description
     *
     * @tags Seller
     * @name RegisterSeller
     * @summary Register Seller
     * @request POST:/seller/signup
     */
    registerSeller: (data: SellerCreate, params: RequestParams = {}) =>
      this.request<SellerRead, HTTPValidationError>({
        path: `/seller/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name LoginSeller
     * @summary Login Seller
     * @request POST:/seller/token
     */
    loginSeller: (data: BodyLoginSeller, params: RequestParams = {}) =>
      this.request<TokenData, HTTPValidationError>({
        path: `/seller/token`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name GetSellerProfile
     * @summary Get Seller Profile
     * @request GET:/seller/me
     * @secure
     */
    getSellerProfile: (params: RequestParams = {}) =>
      this.request<SellerRead, any>({
        path: `/seller/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name GetShipments
     * @summary Get Shipments
     * @request GET:/seller/shipments
     * @secure
     */
    getShipments: (params: RequestParams = {}) =>
      this.request<Shipment[], any>({
        path: `/seller/shipments`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name ForgotPassword
     * @summary Forgot Password
     * @request GET:/seller/forgot_password
     */
    forgotPassword: (
      query: {
        /**
         * Email
         * @format email
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/seller/forgot_password`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name GetResetPasswordForm
     * @summary Get Reset Password Form
     * @request GET:/seller/reset_password_form
     */
    getResetPasswordForm: (
      query: {
        /** Token */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/seller/reset_password_form`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name ResetPassword
     * @summary Reset Password
     * @request POST:/seller/reset_password
     */
    resetPassword: (
      query: {
        /** Token */
        token: string;
      },
      data: BodyResetPassword,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/seller/reset_password`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Seller
     * @name LogoutSeller
     * @summary Logout Seller
     * @request GET:/seller/logout
     * @secure
     */
    logoutSeller: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/seller/logout`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  partner = {
    /**
     * No description
     *
     * @tags Delivery Partner
     * @name RegisterDeliveryPartner
     * @summary Register Delivery Partner
     * @request POST:/partner/signup
     */
    registerDeliveryPartner: (data: DeliveryPartnerCreate, params: RequestParams = {}) =>
      this.request<DeliveryPartnerRead, HTTPValidationError>({
        path: `/partner/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name LoginDeliveryPartner
     * @summary Login Delivery Partner
     * @request POST:/partner/token
     */
    loginDeliveryPartner: (data: BodyLoginDeliveryPartner, params: RequestParams = {}) =>
      this.request<TokenData, HTTPValidationError>({
        path: `/partner/token`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name GetDeliveryPartnerProfile
     * @summary Get Delivery Partner Profile
     * @request GET:/partner/me
     * @secure
     */
    getDeliveryPartnerProfile: (params: RequestParams = {}) =>
      this.request<DeliveryPartnerRead, any>({
        path: `/partner/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name GetShipments
     * @summary Get Shipments
     * @request GET:/partner/shipments
     * @secure
     */
    getShipments: (params: RequestParams = {}) =>
      this.request<Shipment[], any>({
        path: `/partner/shipments`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name UpdateDeliveryPartner
     * @summary Update Delivery Partner
     * @request POST:/partner/
     * @secure
     */
    updateDeliveryPartner: (data: DeliveryPartnerUpdate, params: RequestParams = {}) =>
      this.request<DeliveryPartnerRead, HTTPValidationError>({
        path: `/partner/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name ForgotPassword
     * @summary Forgot Password
     * @request GET:/partner/forgot_password
     */
    forgotPassword: (
      query: {
        /**
         * Email
         * @format email
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/partner/forgot_password`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name GetResetPasswordForm
     * @summary Get Reset Password Form
     * @request GET:/partner/reset_password_form
     */
    getResetPasswordForm: (
      query: {
        /** Token */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/partner/reset_password_form`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name ResetPassword
     * @summary Reset Password
     * @request POST:/partner/reset_password
     */
    resetPassword: (
      query: {
        /** Token */
        token: string;
      },
      data: BodyResetPassword,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/partner/reset_password`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Delivery Partner
     * @name LogoutDeliveryPartner
     * @summary Logout Delivery Partner
     * @request GET:/partner/logout
     * @secure
     */
    logoutDeliveryPartner: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/partner/logout`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
