import esriConfig from "@arcgis/core/config";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import "@esri/calcite-components/components/calcite-button";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-navigation-user";
import "@esri/calcite-components/components/calcite-shell";
import "./style.css";

esriConfig.portalUrl = "https://jsapi.maps.arcgis.com/";

init();

async function init() {
  const signInButton =
    document.querySelector<HTMLCalciteButtonElement>("#sign-in-button");

  const navigationUser =
    document.querySelector<HTMLCalciteNavigationUserElement>(
      "calcite-navigation-user"
    );

  signInButton!.addEventListener("click", () => {
    signInOrOut();
  });

  navigationUser!.addEventListener("click", () => {
    signInOrOut();
  });

  const info = new OAuthInfo({
    appId: "fdlptIOlDa0GGGMe",
    portalUrl: esriConfig.portalUrl,
    popup: false,
  });

  esriId.registerOAuthInfos([info]);

  try {
    await esriId.checkSignInStatus(info.portalUrl + "/sharing");
    navigationUser!.hidden = false;
    signInButton!.hidden = true;

    const portal = new Portal();
    portal.authMode = "immediate";
    await portal.load();

    if (navigationUser) {
      navigationUser.fullName = portal.user?.fullName ?? "";
      navigationUser.username = portal.user?.username ?? "";
    }

    load();
  } catch (error) {
    if ((error as Error).name === "identity-manager:not-authenticated") {
      signInButton!.hidden = false;
      navigationUser!.hidden = true;
      destroy();
    } else {
      console.error(error);
    }
  }

  async function destroy() {
    const arcgisMap = document.querySelector("arcgis-map");
    arcgisMap?.remove();
  }

  async function signInOrOut() {
    try {
      await esriId.checkSignInStatus(info.portalUrl + "/sharing");
      esriId.destroyCredentials();
      window.location.reload();
    } catch (error) {
      if ((error as Error).name === "identity-manager:not-authenticated") {
        esriId.getCredential(info.portalUrl + "/sharing");
      }
    }
  }
}

async function load() {
  await import("@arcgis/map-components/dist/components/arcgis-map");
}
