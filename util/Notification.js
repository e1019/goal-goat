import quote from "inspirational-quotes";

async function registerServiceWorker(){
    if(!("serviceWorker" in navigator)) return false;
    if(!('showTrigger' in Notification.prototype)) return false;

    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
}


async function getNotificationPermission(){
    const permission = await window.Notification.requestPermission();
    return permission === "granted";
}


async function doNotification(){
    const serviceWorker = await registerServiceWorker();
    if(!serviceWorker) return;

    const notifications = await serviceWorker.getNotifications({includeTriggered: true});
    if(Array.isArray(notifications) && notifications.length > 0) return;

    if(!(await getNotificationPermission())) return;

    const tomorrow = (new Date()).addDays(1);
    const tomorrowMorning = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9);

    console.log("Scheduling notification...");
    serviceWorker.showNotification("Morning Notification", {
        tag: Math.random().toString(),
        body: "Good morning! Take this opportunity to view your goals for today! " + quote.getRandomQuote(),
        showTrigger: new TimestampTrigger(tomorrowMorning.getTime()),
        icon: "/logo-256x256.png"
    });
}

export { doNotification }
