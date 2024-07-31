import "@arcgis/core/assets/esri/themes/light/main.css";
import esriConfig from "@arcgis/core/config";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";
import "./style.css";

defineCustomElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/2.10.1/assets",
});

esriConfig.portalUrl = "https://jsapi.maps.arcgis.com/";

init();

function init() {
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

  esriId
    .checkSignInStatus(info.portalUrl + "/sharing")
    .then(async () => {
      navigationUser!.hidden = false;
      signInButton!.hidden = true;

      const portal = new Portal();
      portal.authMode = "immediate";
      await portal.load();

      navigationUser!.fullName = portal.user.fullName;
      navigationUser!.username = portal.user.username;

      load();
    })
    .catch(() => {
      signInButton!.hidden = false;
      navigationUser!.hidden = true;
      destroy();
    });

  async function destroy() {
    const arcgisMap = document.querySelector("arcgis-map");
    arcgisMap?.remove();
  }

  function signInOrOut() {
    esriId
      .checkSignInStatus(info.portalUrl + "/sharing")
      .then(() => {
        esriId.destroyCredentials();
        window.location.reload();
      })
      .catch(() => {
        esriId.getCredential(info.portalUrl + "/sharing");
      });
  }
}

async function load() {
  await import("@arcgis/map-components/dist/components/arcgis-map");
}
