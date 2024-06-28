import { UserInterface } from "./user";

export interface Files {
    id:             string;
    name:           string;
    path:           string;
    depar:          string;
    status:         string 
    createdAt:      Date;
    uploadedById:   string;
    assignedToId:   null;
    uploadedBy:     UploadedBy;
    assignedTo:    UserInterface
    uploadedByName: string;
}

export interface FilesUpdate {
    name?:           string;
    depar?:          string;
    status?:         string 
    createdAt?:      Date;
    assignedToId?:   string;
}

export interface UploadedBy {
    id:       string;
    name:     string;
    email:    string;
    password: string;
    role:     string;
}

