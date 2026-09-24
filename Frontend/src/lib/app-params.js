const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

/**
 * Récupère une valeur de paramètre (depuis l'URL ou le Storage)
 * On utilise maintenant des clés simples sans le préfixe base44_
 */
const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    return defaultValue;
  }

  const storageKey = paramName; // Clé directe (ex: 'token')
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl && searchParam) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  const storedValue = storage.getItem(storageKey);
  if (storedValue) {
    return storedValue;
  }

  return defaultValue || null;
}

const getAppParams = () => {
  // Nettoyage manuel du token si demandé dans l'URL
  if (getAppParamValue("clear_token") === 'true') {
    storage.removeItem('token');
  }

  return {
    // On récupère le token (souvent passé comme 'access_token' ou 'token' dans l'URL)
    token: getAppParamValue("access_token", { removeFromUrl: true }) || getAppParamValue("token"),
    
    // L'URL de ton API définie dans ton fichier .env
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    
    // URL de retour pour les redirections
    fromUrl: isNode ? "" : window.location.href,
  }
}

export const appParams = {
  ...getAppParams()
}