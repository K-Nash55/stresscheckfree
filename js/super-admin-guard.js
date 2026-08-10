// スーパーアドミン画面(super_dashboard.html / superadmin.html)共通の入場チェック
(async function () {
  var ALLOWED_EMAIL = 'ken.nakanishi02@gmail.com';
  var { data } = await supabase.auth.getSession();
  var session = data && data.session;
  if (!session || !session.user || session.user.email !== ALLOWED_EMAIL) {
    var here = encodeURIComponent(location.pathname.split('/').pop());
    window.location.replace('super-login.html?redirect=' + here);
  }
})();
