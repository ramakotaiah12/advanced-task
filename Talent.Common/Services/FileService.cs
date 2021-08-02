//Changed File
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            string fileURL = "";
            try
            {
                
                fileURL = await _awsService.GetPresignedUrlObject(id, "advancedtaskaws");
                return fileURL;
            }
            catch
            {
                return null;
            }
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            var uniqueFileName = "";

            string pathWeb = "";

            pathWeb = _environment.WebRootPath;
            string pathValue = pathWeb + _tempFolder;

            uniqueFileName = $@"{DateTime.Now.Ticks}_" + file.FileName;

            var path = pathValue + uniqueFileName;

            if (file != null && type == FileType.ProfilePhoto && pathWeb != "")

            {

               

                using (var fileStream = new FileStream(path, FileMode.Create))

                {

                    await file.CopyToAsync(fileStream);

                   if(!await _awsService.PutFileToS3(path, fileStream, "advancedtaskaws"))

                    {

                        path = "";

                    }

                }

            }

            return path;
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            await _awsService.RemoveFileFromS3(id, "advancedtaskaws");
            return true;
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
