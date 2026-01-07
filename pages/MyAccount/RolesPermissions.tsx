
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, CheckCircle, XCircle, Edit2, Save, X, Lock, 
  AlertCircle, Check, HelpCircle, Clock, Search, ChevronDown, ChevronRight,
  Layers
} from '../../components/Icons';
import { useToast } from '../../components/Toast';

const ROLE_DATA = {
  "roleId": "R-SUPER-ADMIN",
  "roleName": "Super Administrator",
  "description": "Comprehensive access control for all system modules including Source AI, Engage AI, Chatbots, and System Settings.",
  "lastUpdated": "2025-05-21T14:00:00Z",
  "accessabilitySettings": {
    "System & Administration": {
        "overRide": true,
        "globalSearch": true,
        "tableEdit": {
            "visible": true,
            "enabled": true,
            "saveDefault": true
        },
        "settings": {
            "enabled": true,
            "visible": true,
            "companyInfo": { "enabled": true, "visible": true },
            "notifications": { "enabled": true, "visible": true },
            "activities": { "visible": true, "enabled": true },
            "themes": { "enabled": true, "visible": true },
            "tags": { "enabled": true, "visible": true, "applicationTags": true, "profileTags": true },
            "authenticationSettings": { "enabled": true, "visible": true },
            "teams": { "enabled": true, "visible": true },
            "users": {
                "enabled": true, "visible": true,
                "createUser": true, "updateUser": true, "removeUser": true,
                "userClients": false, "clientUsers": false
            },
            "clients": {
                "enabled": true, "visible": true,
                "createClient": true, "updateClient": true, "removeClient": true,
                "MriPreferences": false
            },
            "roles": {
                "enabled": true, "visible": true,
                "createRole": true, "updateRole": true, "removeRole": true,
                "copyRole": true
            }
        }
    },
    "Chatbot & AI": {
        "chatbot": {
            "enabled": true,
            "visible": true,
            "createBot": { "enabled": true, "visible": true },
            "knowledgeBase": { "enabled": true, "visible": true },
            "campaignAnalytics": { "enabled": true, "visible": true },
            "helperBot": { "enabled": true, "visible": true },
            "chatbots": { "enabled": true, "visible": true },
            "botAnalytics": { "enabled": true, "visible": true },
            "botConversations": { "enabled": true, "visible": true },
            "botPerformance": { "enabled": true, "visible": true },
            "dashboard": { "enabled": true, "visible": true },
            "model": { "enabled": true, "visible": true },
            "flow": { "enabled": true, "visible": true }
        },
        "genAI": {
            "enabled": true,
            "visible": true,
            "genAIEmailContext": { "enabled": true, "visible": true }
        }
    },
    "Source AI": {
        "sourceAI": {
            "enabled": true,
            "visible": true,
            "campaigns": {
                "createCampaign": true, "updateCampaign": true, "removeCampaign": true,
                "jobFitScore": true, "copyCampaign": true
            },
            "portalSourcing": {
                "enabled": true, "visible": false,
                "createQuery": true, "runQuery": true, "removeQuery": true
            },
            "uploadFiles": {
                "enabled": true, "visible": true,
                "uploadResumes": true, "uploadExcel": true
            },
            "searchPeople": {
                "enabled": true, "visible": true,
                "byKeywords": true, "byTags": true, "byFolder": true
            },
            "integration": {
                "enabled": true, "visible": true,
                "createEmailSubject": true, "updateEmailSubject": true, "removeEmailSubject": true
            },
            "recommendedPeople": {
                "enabled": true,
                "linkPeople": true, "sharePeople": true, "quickAccess": true, "filters": true,
                "matchMRI": false, "matchVector": true, "advancedSearch": true
            }
        },
        "profiles": {
            "enabled": true, "visible": true,
            "advancedSearch": { "visible": true, "enabled": true },
            "suggestedEntities": true,
            "suggestedSearches": true,
            "queryAnalysis": true,
            "matchedEntities": true,
            "filters": true
        }
    },
    "Engage AI": {
        "engageAI": {
            "enabled": true, "visible": true,
            "screeningRound": {
                "enabled": true,
                "createScreeningRound": true, "updateScreeningRound": true, "removeScreeningRound": true,
                "directVideo": true,
                "screening": { "enabled": true, "visible": true, "interviewTemplates": true, "recommendedQuestions": true },
                "announcement": { "enabled": true, "visible": true, "interviewTemplates": false },
                "liveVideo": { "enabled": true, "visible": true, "interviewTemplates": true },
                "interview": { "enabled": true, "visible": true, "interviewTemplates": true }
            },
            "calendarSync": {
                "googleCalendar": { "enabled": false, "visible": false },
                "outlookCalendar": { "enabled": true, "visible": true, "microsoftTeams": { "enabled": true, "visible": true, "default": true } }
            },
            "automation": { "enabled": true, "visible": true },
            "autoSchedule": { "enabled": true, "visible": true },
            "questionnaire": {
                "enabled": true, "visible": true,
                "recommendedQuestions": true, "existingQuestions": true, "createQuestions": true
            },
            "reachOut": {
                "enabled": true, "visible": true,
                "massEmail": true, "generateMassEmail": true,
                "massSMS": true,
                "email": {
                    "enabled": true, "visible": true,
                    "generateReachOutEmail": true, "invitationTemplatesEnabled": true,
                    "announcementTemplatesEnabled": true
                },
                "sms": {
                    "enabled": true, "visible": true,
                    "generateReachOutSMS": true, "invitationTemplatesEnabled": true
                }
            }
        },
        "talentChat": {
            "enabled": true, "visible": true,
            "trainedIntent": { "enabled": true, "visible": true },
            "analytics": { "enabled": true, "visible": true },
            "contacts": { "enabled": true, "visible": true }
        }
    },
    "Match AI & Intelligence": {
        "matchAI": {
            "enabled": true,
            "visible": true,
            "visualizeProfiles": false,
            "matchSimilarEntitiesSwitch": true,
            "genAI": { "visible": true, "autoGenerate": true, "generateOnClick": true },
            "calculateMRI": { "recalculate": true, "updateSkills": false, "updatePreferences": true }
        },
        "intelligence": {
            "enabled": true, "visible": true,
            "settings": true,
            "jobPosting": { "enabled": true, "visible": false }
        }
    },
    "Core Entities": {
        "campaigns": {
            "enabled": true, "visible": true,
            "generateJobDescription": true,
            "enhanceJobDescription": true,
            "acceptCampaign": true,
            "declineCampaign": true,
            "campaignSettings": {
                "status": { "enabled": true, "visible": true },
                "owner": { "enabled": true, "visible": true },
                "hiringManager": { "enabled": true, "visible": true }
            }
        },
        "jobs": {
            "enabled": false, "visible": false,
            "approvalRequired": true,
            "createJob": true
        },
        "folders": { "enabled": true, "visible": true }
    },
    "Metrics & Analytics": {
        "metrics": {
            "enabled": true, "visible": true,
            "engageMetrics": { "enabled": true, "visible": true },
            "jobBoardMetrics": { "enabled": true, "visible": true },
            "usageMetrics": { "enabled": true, "visible": true },
            "chatbotMetrics": { "enabled": true, "visible": true },
            "peoplesAnalytics": { "enabled": true, "visible": true },
            "accessLevel": "Client"
        },
        "tables": {
            "dashboardTables": {
                "hiringMetrics": { "enabled": true, "visible": true },
                "activeCampaigns": { "enabled": true, "visible": true },
                "receivedInterviews": { "enabled": true, "visible": true }
            },
            "downloadTable": true
        }
    }
  }
};

// --- UTILS ---

const formatKey = (key: string) => {
    // CamelCase to Title Case
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

// Recursive function to flatten nested objects into a single depth map for UI rendering
const flattenPermissions = (obj: any, prefix = ''): Record<string, boolean> => {
    let result: Record<string, boolean> = {};
    
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Check for leaf node with {enabled, visible} structure
            if (Object.keys(obj[key]).length >= 1 && 'enabled' in obj[key]) {
                 // It's a leaf node with meta data
                 result[`${prefix}${formatKey(key)}`] = obj[key].enabled;
            } else {
                 const nested = flattenPermissions(obj[key], `${prefix}${formatKey(key)} › `);
                 result = { ...result, ...nested };
            }
        } else if (typeof obj[key] === 'boolean') {
            // It's a leaf permission
            if (key !== 'visible' && key !== 'enabled') {
                result[`${prefix}${formatKey(key)}`] = obj[key];
            } else if (key === 'enabled' && prefix) {
                // If the key is 'enabled' and we have a prefix, assign it to the prefix (parent name)
                const parentName = prefix.slice(0, -3); // remove ' › '
                result[parentName] = obj[key];
            }
        }
    }
    return result;
};

// New Type definition for structured Data
type SubCategoryMap = Record<string, Record<string, boolean>>; // SubCategory -> { Permission: Bool }
type CategoryMap = Record<string, SubCategoryMap>; // Category -> SubCategories

export const RolesPermissions = () => {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transform data into Category -> SubCategory -> Permissions
  const [permissionStructure, setPermissionStructure] = useState<CategoryMap>({});
  const [originalStructure, setOriginalStructure] = useState<CategoryMap>({});

  // Initialize Data with Subcategory Logic
  useEffect(() => {
      const rawSettings = ROLE_DATA.accessabilitySettings as any;
      const transformed: CategoryMap = {};

      Object.keys(rawSettings).forEach(catKey => {
          const catData = rawSettings[catKey];
          transformed[catKey] = {};

          // Loop through keys inside the category to determine subcategories
          Object.keys(catData).forEach(subKey => {
              const subData = catData[subKey];
              const formattedSubKey = formatKey(subKey);

              if (typeof subData === 'boolean') {
                  // Direct permission at root level -> Group under 'General'
                  if (!transformed[catKey]['General']) transformed[catKey]['General'] = {};
                  transformed[catKey]['General'][formattedSubKey] = subData;
              } 
              else if (typeof subData === 'object' && subData !== null) {
                  // Check if it's a "fake" subcategory (just a single permission with metadata)
                  const isLeafNode = 'enabled' in subData && Object.keys(subData).length <= 3; // heuristic
                  
                  if (isLeafNode) {
                      if (!transformed[catKey]['General']) transformed[catKey]['General'] = {};
                      transformed[catKey]['General'][formattedSubKey] = subData.enabled;
                  } else {
                      // Real subcategory
                      transformed[catKey][formattedSubKey] = flattenPermissions(subData);
                  }
              }
          });
      });

      setPermissionStructure(transformed);
      setOriginalStructure(JSON.parse(JSON.stringify(transformed)));
  }, []);

  const handleCancel = () => {
    setPermissionStructure(JSON.parse(JSON.stringify(originalStructure)));
    setIsEditing(false);
    addToast("Changes discarded", "info");
  };

  const handleSave = () => {
    setOriginalStructure(JSON.parse(JSON.stringify(permissionStructure)));
    setIsEditing(false);
    addToast("Permissions updated successfully", "success");
  };

  const togglePermission = (category: string, subCategory: string, key: string) => {
    setPermissionStructure((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
            ...prev[category][subCategory],
            [key]: !prev[category][subCategory][key]
        }
      }
    }));
  };

  // Filter logic including Subcategories
  const filteredStructure = useMemo(() => {
      if (!searchQuery) return permissionStructure;
      
      const result: CategoryMap = {};
      
      Object.keys(permissionStructure).forEach(cat => {
          const subCats = permissionStructure[cat];
          const filteredSubCats: SubCategoryMap = {};
          let catHasMatch = false;

          Object.keys(subCats).forEach(subCat => {
              const perms = subCats[subCat];
              const filteredPerms: Record<string, boolean> = {};
              let subHasMatch = false;

              // Check if SubCategory Name matches
              if (subCat.toLowerCase().includes(searchQuery.toLowerCase())) {
                  subHasMatch = true;
                  Object.assign(filteredPerms, perms); // Include all if subcat matches
              } else {
                  // Check specific permissions
                  Object.keys(perms).forEach(permKey => {
                      if (permKey.toLowerCase().includes(searchQuery.toLowerCase())) {
                          filteredPerms[permKey] = perms[permKey];
                          subHasMatch = true;
                      }
                  });
              }

              if (subHasMatch) {
                  filteredSubCats[subCat] = filteredPerms;
                  catHasMatch = true;
              }
          });

          if (catHasMatch) {
              result[cat] = filteredSubCats;
          }
      });
      
      return result;
  }, [permissionStructure, searchQuery]);

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-300 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
           <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield size={22} className="text-indigo-600 dark:text-indigo-400"/> 
                Roles & Permissions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                View and manage granular access controls for your account.
              </p>
           </div>
           
           <div className="flex gap-3">
              {isEditing ? (
                  <>
                      <button 
                          onClick={handleCancel}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleSave}
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                      >
                          <Save size={16} /> Save Changes
                      </button>
                  </>
              ) : (
                  <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                  >
                      <Edit2 size={16} /> Edit Permissions
                  </button>
              )}
           </div>
        </div>

        {/* Role Overview Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Lock size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{ROLE_DATA.roleName}</h3>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full font-mono">
                            {ROLE_DATA.roleId}
                        </span>
                    </div>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                        {ROLE_DATA.description}
                    </p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-3 flex items-center gap-1">
                        <Clock size={12} /> Last updated: {new Date(ROLE_DATA.lastUpdated).toLocaleDateString()}
                    </p>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-64 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500" />
                <input 
                    type="text" 
                    placeholder="Search permissions..." 
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 placeholder:text-indigo-300 dark:placeholder:text-indigo-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {Object.entries(filteredStructure).map(([category, subCategories]) => (
                <div key={category} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
                    {/* Category Header */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                            {category}
                        </h4>
                        
                        {/* Global Active Badge */}
                        <div className="flex gap-1">
                            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-medium border border-green-200 dark:border-green-800">
                                {Object.values(subCategories).reduce((acc, sub) => acc + Object.values(sub).filter(Boolean).length, 0)} Active
                            </span>
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-4 overflow-y-auto custom-scrollbar flex-1 max-h-[500px]">
                        {Object.entries(subCategories).length > 0 ? (
                            Object.entries(subCategories).map(([subCategory, permissions], idx) => (
                                <div key={subCategory} className={`mb-4 last:mb-0 ${idx !== 0 ? 'mt-6' : ''}`}>
                                    {/* Subcategory Header */}
                                    {subCategory !== 'General' && (
                                        <div className="flex items-center gap-2 mb-2 px-2">
                                            <Layers size={14} className="text-indigo-400 dark:text-indigo-500" />
                                            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {subCategory}
                                            </h5>
                                            <div className="h-px bg-slate-100 dark:bg-slate-700 flex-1 ml-2"></div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {Object.entries(permissions).map(([key, value]) => (
                                            <div 
                                                key={key} 
                                                className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${isEditing ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer' : ''} ${!value && !isEditing ? 'opacity-50' : ''}`}
                                                onClick={() => isEditing && togglePermission(category, subCategory, key)}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${value ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                                        {value ? <Check size={10} /> : <X size={10} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-xs font-medium truncate ${value ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`} title={key}>
                                                            {key}
                                                        </p>
                                                    </div>
                                                </div>

                                                {isEditing ? (
                                                    <div className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                                                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-4' : 'translate-x-0'}`} />
                                                    </div>
                                                ) : (
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${value ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>
                                                        {value ? 'On' : 'Off'}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs italic">
                                No permissions found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-bold mb-1">Permission Inheritance</p>
                <p className="opacity-90">
                    Changes made here apply directly to your account scope. Some permissions may be overridden by Organization-level policies or locked by System Administrators.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};
