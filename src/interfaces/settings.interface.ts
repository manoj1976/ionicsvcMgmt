export interface ISettings{
      Username:string;
      Useremail:string;
      Regemail:string;
      WebapiBaseURL:string;
      AzureStorageContainer:string; //Azure blob storage url e.g. https://pscprodimage.blob.core.windows.net/productimage/
      Offline:number; //there is no boolean type in SQLLite database
}