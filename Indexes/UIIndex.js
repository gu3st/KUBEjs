(function(KUBE){
    var UIIndex = KUBE.AutoLoad().GetNewIndex();
    UIIndex.SetNamespace('/Library/UI');
    UIIndex.SetBaseURL(KUBE.Config().autoLoadPath+'Library/UI');
    UIIndex.SetIndex([
        'Appearance',
        'Theme',
        'ThemeManager',
        'UI'
    ]);

    KUBE.AutoLoad().AddIndex(UIIndex);

}(KUBE));