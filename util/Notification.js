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
    
    if(!(await getNotificationPermission())) return;

    const notifications = await serviceWorker.getNotifications({includeTriggered: true});
    if(Array.isArray(notifications)) notifications.forEach(v => v.close()); // cancel existing notifications

    const tomorrow = (new Date()).addDays(1);
    tomorrow.setHours(9, 0, 0, 0);

    console.log("Scheduling notification...");
    serviceWorker.showNotification("Morning Notification", {
        tag: Math.random().toString(),
        body: "Good morning! Take this opportunity to view your goals for today! " + quote.getRandomQuote(),
        showTrigger: new TimestampTrigger(tomorrow.getTime()),
        icon: "/logo-256x256.png"
    });
}

export { doNotification }
