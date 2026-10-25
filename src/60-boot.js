
/* Boot */
applyPrefs();
window.addEventListener('hashchange', route);
document.addEventListener('click', handleClick);
document.addEventListener('submit', handleSubmit);
document.addEventListener('change', handleChange);
document.addEventListener('input', handleInput);
document.addEventListener('keydown', handleKey);
setInterval(tickAlerts, 30000);
route();
