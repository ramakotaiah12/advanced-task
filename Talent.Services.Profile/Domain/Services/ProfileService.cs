using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userSkillRepository = userSkillRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _userExperienceRepository = userExperienceRepository;

        }

        public async Task<bool> AddNewLanguage(AddLanguageViewModel language)
        {
            language.CurrentUserId = _userAppContext.CurrentUserId;
            if(language.CurrentUserId != null)
            {
                var objectId = ObjectId.GenerateNewId().ToString();
                
                var newUserLanguage = new UserLanguage
                {
                    Id = objectId,
                    UserId = language.CurrentUserId,
                    Language = language.Name,
                    LanguageLevel = language.Level,
                    IsDeleted = false

                };
                await _userLanguageRepository.Add(newUserLanguage);
                return true;
            }
            return false;
           
            
        }
       public async Task<bool> UpdateLanguage(AddLanguageViewModel language)

        {
            language.CurrentUserId = _userAppContext.CurrentUserId;
            if (language.CurrentUserId != null && language.Id != null)
            {
                UserLanguage existingLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);
                existingLanguage.Language = language.Name;
                existingLanguage.LanguageLevel = language.Level;


                await _userLanguageRepository.Update(existingLanguage);
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteLanguage(AddLanguageViewModel language)
        {
            if (language.Id != null)
            {

                UserLanguage existingLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);
                await _userLanguageRepository.Delete(existingLanguage);
                return true;
            }
            return false;
        }
        public async Task<bool> AddNewSkill(AddSkillViewModel skill)
        {
            skill.CurrentUserId = _userAppContext.CurrentUserId;
            if (skill.CurrentUserId != null)
            {
                var objectId = ObjectId.GenerateNewId().ToString();

                var newUserSkill = new UserSkill
                {
                    Id = objectId,
                    UserId = skill.CurrentUserId,
                    Skill = skill.Name,
                    ExperienceLevel = skill.Level,
                    IsDeleted = false

                };
                await _userSkillRepository.Add(newUserSkill);
                return true;
            }
            return false;


        }
        public async Task<bool> UpdateSkill(AddSkillViewModel skill)

        {
            skill.CurrentUserId = _userAppContext.CurrentUserId;
            if (skill.CurrentUserId != null && skill.Id != null)
            {
                UserSkill existingSkill = await _userSkillRepository.GetByIdAsync(skill.Id);
                existingSkill.Skill = skill.Name;
                existingSkill.ExperienceLevel = skill.Level;


                await _userSkillRepository.Update(existingSkill);
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteSkill(AddSkillViewModel skill)
        {
            if (skill.Id != null)
            {

                UserSkill existingSkill = await _userSkillRepository.GetByIdAsync(skill.Id);
                await _userSkillRepository.Delete(existingSkill);
                return true;
            }
            return false;
        }
        public async Task<bool> AddNewExperience(ExperienceViewModel experience)
        {
            experience.UserId = _userAppContext.CurrentUserId;
            if (experience.UserId != null)
            {
                var objectId = ObjectId.GenerateNewId().ToString();

                var newUserExperience = new UserExperience
                {
                    Id = objectId,
                    UserId = experience.UserId,
                    IsDeleted = false,
                    Company = experience.Company,
                    Position = experience.Position,
                    Responsibilities = experience.Responsibilities,
                    Start = experience.Start,
                    End = experience.End

                };
                await _userExperienceRepository.Add(newUserExperience);
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateExperience(ExperienceViewModel experience)
        {
            experience.UserId = _userAppContext.CurrentUserId;

            if (experience.UserId != null && experience.Id != null)
            {
                UserExperience existingExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);

                existingExperience.Company = experience.Company;
                existingExperience.Position = experience.Position;
                existingExperience.Responsibilities = experience.Responsibilities;
                existingExperience.Start = experience.Start;
                existingExperience.End = experience.End;

                await _userExperienceRepository.Update(existingExperience);
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteExperience(ExperienceViewModel experience)
        {
            if (experience.Id != null)
            {

                UserExperience existingExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);
                await _userExperienceRepository.Delete(existingExperience);
                return true;
            }
            return false;
        }
        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = null;
            var videoUrl = "";
            var cvUrl = "";

            profile = await _userRepository.GetByIdAsync(Id);
            if (profile != null)
            {
                var languages = await  _userLanguageRepository.Get(x => x.UserId == profile.Id);
               
                var currentUserLanguages = languages.Select(x =>ViewModelFromLanguage(x)).ToList();
                var skills = await _userSkillRepository.Get(x => x.UserId == profile.Id);

                var currentUserSkills = skills.Select(x => ViewModelFromSkill(x)).ToList();
                var experience = await _userExperienceRepository.Get(x => x.UserId == profile.Id);

                var currentExperience = experience.Select(x => ViewModelFromExperience(x)).ToList();

                var education = profile.Education.Select(x => ViewModelFromEucation(x)).ToList();
                var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
               
               videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
                cvUrl = string.IsNullOrWhiteSpace(profile.CvName)
                         ? ""
                         : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);
                profile.ProfilePhotoUrl = string.IsNullOrWhiteSpace(profile.ProfilePhoto)
                          ? ""
                          : await _fileService.GetFileURL(profile.ProfilePhoto, FileType.ProfilePhoto);

                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Gender = profile.Gender,
                    Email = profile.Email,
                    Phone = profile.Phone,
                    MobilePhone = profile.MobilePhone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = profile.CvName,
                    CvUrl = cvUrl,
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Languages = currentUserLanguages,
                    Skills = currentUserSkills,
                    Education = education,
                    Certifications = certifications,
                    Experience = currentExperience





                };
                return result;
            }
            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel profile, string updaterId)
        {
            try
            {
                if(profile.Id != null)
                {
                    User existingTalentProfile = await _userRepository.GetByIdAsync(profile.Id);
                    existingTalentProfile.Id = profile.Id;
                    existingTalentProfile.FirstName = profile.FirstName;
                    existingTalentProfile.MiddleName = profile.MiddleName;
                    existingTalentProfile.LastName = profile.LastName;
                    existingTalentProfile.Gender = profile.Gender;
                    existingTalentProfile.Email = profile.Email;
                    existingTalentProfile.Phone = profile.Phone;
                    existingTalentProfile.MobilePhone = profile.MobilePhone;
                    existingTalentProfile.IsMobilePhoneVerified = profile.IsMobilePhoneVerified;
                    existingTalentProfile.Address = profile.Address;
                    existingTalentProfile.Nationality = profile.Nationality;
                    existingTalentProfile.VisaStatus = profile.VisaStatus;
                    existingTalentProfile.VisaExpiryDate = profile.VisaExpiryDate;
                    existingTalentProfile.ProfilePhoto = profile.ProfilePhoto;
                    existingTalentProfile.ProfilePhotoUrl = profile.ProfilePhotoUrl;
                    existingTalentProfile.VideoName = profile.VideoName;
                    existingTalentProfile.CvName = profile.CvName;
                    existingTalentProfile.Summary = profile.Summary;
                    existingTalentProfile.Description = profile.Description;
                    existingTalentProfile.LinkedAccounts = profile.LinkedAccounts;
                    existingTalentProfile.JobSeekingStatus = profile.JobSeekingStatus;
                    existingTalentProfile.UpdatedBy = updaterId;
                    existingTalentProfile.UpdatedOn = DateTime.Now;

                    var newSkills = new List<UserSkill>();
                    foreach (var item in profile.Skills)
                    {
                        var skill = existingTalentProfile.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    existingTalentProfile.Skills = newSkills;

                    var newLanguages = new List<UserLanguage>();
                    foreach (var item in profile.Languages)
                    {
                        var language = existingTalentProfile.Languages.SingleOrDefault(x => x.Id == item.Id);
                        if (language == null)
                        {
                            language = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, language);
                        newLanguages.Add(language);
                    }
                    existingTalentProfile.Languages = newLanguages;

                    var newEducation = new List<UserEducation>();
                    foreach (var item in profile.Education)
                    {
                        var education = existingTalentProfile.Education.SingleOrDefault(x => x.Id == item.Id);
                        if (education == null)
                        {
                            education = new UserEducation
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateEducationFromView(item, education);
                        newEducation.Add(education);
                    }
                    existingTalentProfile.Education = newEducation;

                    var newCertification = new List<UserCertification>();
                    foreach (var item in profile.Certifications)
                    {
                        var certification = existingTalentProfile.Certifications.SingleOrDefault(x => x.Id == item.Id);
                        if (certification == null)
                        {
                            certification = new UserCertification
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateCertificationFromView(item, certification);
                        newCertification.Add(certification);
                    }
                    existingTalentProfile.Certifications = newCertification;

                    var newExperience = new List<UserExperience>();
                    foreach (var item in profile.Experience)
                    {
                        var experience = existingTalentProfile.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                            };
                        }
                        UpdateExperienceFromView(item, experience);
                        newExperience.Add(experience);
                    }
                    existingTalentProfile.Experience = newExperience;
                    await _userRepository.Update(existingTalentProfile);




                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {

            var profile = await _employerRepository.GetByIdAsync(employerOrJobId);
            var talentProfiles =  _userRepository.GetQueryable().Skip(position).Take(increment);
          
            if (profile != null)
            {
                var newTalentProfiles = new List<TalentSnapshotViewModel>();
                foreach (var item in talentProfiles)
                {

                    var SkillList = new List<String>();
                    if(item.Skills.Count != 0)
                    {
                        foreach (var skill in item.Skills)
                        {
                            SkillList.Add(skill.Skill);

                        }

                    }
                    
                   
                    var currentExperience = "";
                    var level = "";
                    if (item.Experience.Count == 0)
                    {
                       currentExperience = "No Job";
                       level = "No Job";

                    }
                    else
                    {
                        currentExperience = item.Experience[0].Company;
                        level = item.Experience[0].Position;
                    }

                    var talent = new TalentSnapshotViewModel
                    {
                        
                    
                        Id = item.Id,
                        CurrentEmployment = currentExperience,
                        Level = level,
                        Name = item.FirstName +" "+ item.LastName,
                        PhotoId = item.ProfilePhoto,
                        Skills = SkillList,
                        Summary = item.Summary,
                        Visa = item.VisaStatus,
                        LinkedAccounts = item.LinkedAccounts


                    };


                    newTalentProfiles.Add(talent);
                }
                return newTalentProfiles;
            }
            return null;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();


        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }
        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;

        }
        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.InstituteName = model.InstituteName;
            original.Degree = model.Degree;
            original.Title = model.Title;
            original.YearOfGraduation = model.YearOfGraduation;

        }
        
        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationFrom = model.CertificationFrom;
                 original.CertificationName = model.CertificationName;
            original.CertificationYear = model.CertificationYear;

        }
        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
               original.Position = model.Position;
               original.Responsibilities = model.Responsibilities;
               original.Start = model.Start;
            original.End = model.End;

        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill,
                CurrentUserId = skill.UserId
            };
        }
        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language )
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language,
                CurrentUserId = language.UserId,
            };
        }
        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
               Id = experience.Id,
               UserId = experience.UserId,
               Company = experience.Company,
               Position =experience.Position,
               Responsibilities = experience.Responsibilities,
               Start = experience.Start,
               End = experience.End
               
            };
        }
        protected AddEducationViewModel ViewModelFromEucation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName =education.InstituteName,
                Degree = education.Degree,
                Title =education.Title,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id

            };
        }
        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationFrom =certification.CertificationFrom,
                CertificationName = certification.CertificationName,
                CertificationYear = certification.CertificationYear
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }

        


        #endregion

    }
}
