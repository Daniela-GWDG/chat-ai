import { Email, Logout } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import UserAvatar from "../../components/Header/UserAvatar";

import {
  selectShowUsageInSidebar,
  setShowUsageInSidebar,
} from "../../Redux/reducers/interfaceSettingsSlice";
import UserLimitsDisplay from "./UserLimitsDisplay";
import OrgLimitsDisplay from "./OrgLimitsDisplay";
import ProfilePreferenceSwitch from "./ProfilePreferenceSwitch";
import { UsageDetailsPanel } from "./SidebarUsageSummary";

/** Account details and sign-out (settings tab "Profile"). */
export default function UserInfoContainer({ userData }) {
  const { t } = useTranslation();
  const firstName = userData?.firstname ?? "";
  const lastName = userData?.lastname ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  const handleLogout = () => {
    window.location.href =
      "https://keycloak.sso.gwdg.de/auth/realms/academiccloud/protocol/openid-connect/logout";
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar userData={userData} />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-base-content">
                {fullName || t("common.loading")}
              </h3>
              <p className="mt-0.5 truncate text-xs text-base-content/70">
                {userData?.organization ?? t("common.loading")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-sm"
          >
            <Logout size={16} aria-hidden="true" />
            {t("user_settings.logout")}
          </button>
        </div>

        <dl className="grid gap-3 border-t border-base-300 pt-4 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-base-content/70">
              {t("user_settings.account.username")}
            </dt>
            <dd
              className="mt-1 truncate text-sm text-base-content"
              title={userData?.username}
            >
              {userData?.username ?? t("common.loading")}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-base-content/70">
              <Email size={14} aria-hidden="true" />
              {t("user_settings.account.email")}
            </dt>
            <dd
              className="mt-1 truncate text-sm text-base-content"
              title={userData?.email}
            >
              {userData?.email ?? t("common.loading")}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/** Budgets and limits (settings tab "Usage"). */
export function UsageInfoContainer({ userData }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const showUsageInSidebar = useSelector(selectShowUsageInSidebar);

  return (
    <div className="flex flex-col gap-5">
      <UsageDetailsPanel data={userData} />

      {userData?.limits && (
        <section className="flex flex-col gap-3 border-t border-base-300 pt-5">
          <UserLimitsDisplay limits={userData.limits} />
          <OrgLimitsDisplay limits={userData.limits} />
          <div className="border-t border-base-300 pt-1">
            <ProfilePreferenceSwitch
              label={t("user_settings.sidebar_usage.label")}
              description={t("user_settings.sidebar_usage.description")}
              checked={showUsageInSidebar}
              onChange={(checked) =>
                dispatch(setShowUsageInSidebar(checked))
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}
