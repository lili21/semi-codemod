# codemod for migrating Antd@4.x to Semi

## Usage

```
$ npx semi-codemod <path> <transform>
```

Replacing `<path>` and `<transform>` with appropriate values.

* path - files or directory to transform
* transform - name of transform
* --dry Do a dry-run, no code will be edited
* --print Prints the changed output for comparison

## FYI

不支持样式的自动化迁移，如果有对antd组件样式做扩展or覆盖的，需要手动更新


## TODO

- [x] Divider
- [ ] Table
- [x] Breadcrumb
- [ ] Notification
- [ ] message
- [ ] Button
- [ ] Popconfirm
- [ ] Tooltip
- [ ] Divider
- [ ] Tabs
- [ ] Drawer
- [ ] Spin
- [ ] Empty
- [ ] Modal
- [ ] Slider
- [ ] Popover
- [ ] Col
- [ ] Row
- [ ] Tag
- [ ] Timeline
- [ ] Pagenation
