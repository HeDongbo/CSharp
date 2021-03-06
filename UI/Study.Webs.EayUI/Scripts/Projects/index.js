﻿//主界面初始化
$(function () {
    //主界面选项卡
    var $tabs = $('#divMainTabs');
    collapseFoot();
    addDesktopTab();
    bindTreeClick();
    bindTabsMenuClick();
    bindTabsEvent();

    //收缩页脚
    function collapseFoot() {
        $('#divMain').layout('collapse', 'south');
    }

    //添加我的桌面选项卡
    function addDesktopTab() {
        $.easyui.addIframeToTabs("divMainTabs", "我的桌面", "Desktop/Index", "icon-house", false);
    }

    function getNodePath(node, result) {
        var parent = $('#divMenuTree').tree('getParent', node.target);
        if (parent != null) {
            getNodePath(parent, result);
        }
        result.push(node.text);
        return result;
    }

    //绑定左侧树单击事件
    function bindTreeClick() {
        $('#divMenuTree').tree({
            onClick: function (node) {
                if (!node.attributes)
                    return;
                var r = getNodePath(node, []);
                var path = "";
                for (var i = 0; i < r.length; i++) {
                    if (i != r.length - 1)
                    {
                        path = path + r[i] + ",";
                    }
                    else
                    {
                        path = path + r[i];
                    }
                }
                var url = node.attributes.url + "?path=" + path;
                $.easyui.addIframeToTabs("divMainTabs", node.text, url, node.attributes.icon, true);
                bindTabsEvent();
            },
            url: 'Home/GetTree'
        });
    }

    //绑定选项卡菜单单击事件
    function bindTabsMenuClick() {
        bindMenuClick('divTabsMenu');
        bindMenuClick('divDesktopTabsMenu');

        function bindMenuClick( contextMenuId ) {
            $('#' + contextMenuId).menu({
                onClick: function (item) {
                    var allTabs = $tabs.tabs('tabs');
                    var selectedTab = $tabs.tabs('getSelected');
                    var selectedIndex = $tabs.tabs('getTabIndex', selectedTab);
                    command(item.id);

                    //执行命令
                    function command(id) {
                        switch (id) {
                            case "menuItem_Refresh":
                                return refresh();
                            case "menuItem_CloseCurrent":
                                return closeCurrent();
                            case "menuItem_CloseOther":
                                return closeOther();
                            case "menuItem_CloseAll":
                                return closeAll();
                        }
                        return true;
                    }

                    //刷新选项卡
                    function refresh() {
                        $.easyui.refreshTabs("divMainTabs");
                    }

                    //关闭当前
                    function closeCurrent() {
                        $tabs.tabs('close', selectedIndex);
                    }

                    //关闭其它
                    function closeOther() {
                        close(function (i) {
                            return i === 0 || i === selectedIndex;
                        });
                        $tabs.tabs('select', 1);
                    }

                    //关闭窗口
                    function close(ignore) {
                        $(allTabs).each(function (i, tab) {
                            if (!ignore(i)) {
                                var index = $tabs.tabs('getTabIndex', tab);
                                $tabs.tabs('close', index);
                            }
                        });
                    }

                    //关闭全部
                    function closeAll() {
                        close(function (i) {
                            return i === 0;
                        });
                    }
                }
            });
        }
    }

    //绑定选项卡事件
    function bindTabsEvent() {
        bindTabsMenu();
        bindTabsDbClick();
    }

    //绑定选项卡右键菜单
    function bindTabsMenu() {
        $tabs.tabs({
            onContextMenu: function (e, title, index) {
                $.easyui.showMenu(getMenuId(), e);
                $tabs.tabs('select', index);

                //获取选项卡菜单Id
                function getMenuId() {
                    return index === 0 ? "divDesktopTabsMenu" : "divTabsMenu";
                }
            }
        });
    }

    //绑定选项卡双击事件
    function bindTabsDbClick() {
        $(".tabs-inner").dblclick(function () {
            var selectedTab = $tabs.tabs('getSelected');
            var selectedIndex = $tabs.tabs('getTabIndex', selectedTab);
            if (selectedIndex === 0)
                return;
            $tabs.tabs('close', selectedIndex);
        });
    }
});
