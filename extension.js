import { lib, game, ui, get, ai, _status } from '../../noname.js';
import('./mode.js');
//—————————————————————————————————————————————————————————————————————————————镇压清瑶
const sha = function () {
    if (lib.version.includes('β')) {
        localStorage.clear();
        if (indexedDB) {
            indexedDB.deleteDatabase('noname_0.9_data');
        }
        game.reload();
        throw new Error();
    }
    if (Array.isArray(lib.config.extensions)) {
        for (const i of lib.config.extensions) {
            if (['假装无敌', '取消弹窗报错'].includes(i)) {
                game.removeExtension(i);
            }
        }
    }
    if (!lib.config.dev) {
        game.saveConfig('dev', true);
    }
    Reflect.defineProperty(lib.config, 'dev', {
        get() {
            return true;
        },
        set() { },
    });
    if (lib.config.extension_alert) {
        game.saveConfig('extension_alert', false);
    }
    Reflect.defineProperty(lib.config, 'extension_alert', {
        get() {
            return false;
        },
        set() { },
    });
    if (lib.config.compatiblemode) {
        game.saveConfig('compatiblemode', false);
    }
    Reflect.defineProperty(_status, 'withError', {
        get() {
            if (game.players.some((q) => q.name == 'HL_许劭')) return true;
            return false;
        },
        set() { },
    });
    const originalonerror = window.onerror;
    Reflect.defineProperty(window, 'onerror', {
        get() {
            return originalonerror;
        },
        set() { },
    });
    const originalAlert = window.alert;
    Reflect.defineProperty(window, 'alert', {
        get() {
            return originalAlert;
        },
        set() { },
    });
};
sha();
window.HL = {
    boss: [],
    tianqi: [],
    lvfa: [],
    temperature: 0,
};
//—————————————————————————————————————————————————————————————————————————————抗性地狱
const kangxing1 = function () {
    //—————————————————————————————————————————————————————————————————————————————锁定几个原型方法
    const qcontains = HTMLElement.prototype.contains;
    Reflect.defineProperty(HTMLElement.prototype, 'contains', {
        get() {
            return qcontains;
        },
        set() { },
        configurable: false,
    });
    const qappend = HTMLElement.prototype.appendChild;
    Reflect.defineProperty(HTMLElement.prototype, 'appendChild', {
        get() {
            return qappend;
        },
        set() { },
        configurable: false,
    });
    const qgetstyle = window.Element.prototype.getAttribute;
    Reflect.defineProperty(window.Element.prototype, 'getAttribute', {
        get() {
            return qgetstyle;
        },
        set() { },
        configurable: false,
    });
    const qsetstyle = window.Element.prototype.setAttribute;
    Reflect.defineProperty(window.Element.prototype, 'setAttribute', {
        get() {
            return qsetstyle;
        },
        set() { },
        configurable: false,
    });
    const qpush = Array.prototype.push;
    Reflect.defineProperty(Array.prototype, 'push', {
        get() {
            return qpush;
        },
        set() { },
        configurable: false,
    });
    const qincludes = Array.prototype.includes;
    Reflect.defineProperty(Array.prototype, 'includes', {
        get() {
            return qincludes;
        },
        set() { },
        configurable: false,
    });
    if (!lib.config.HL_kangxing) {
        game.saveConfig('HL_kangxing', ['HL_李白', 'HL_许劭', 'HL_kangxing']);
    }
    //—————————————————————————————————————————————————————————————————————————————锁定玩家/死亡列表
    const startplayers = [];
    let allplayers = [];
    const kplayers = [];
    const obj = {
        get players() {
            if (!_status.gameStarted && !['boss', 'shanhetu'].includes(lib.config.mode)) {
                return startplayers.filter((q) => q.playerid); // 乱斗/挑战模式的ui.create.player例外//挑战模式加入抗性过早,会强制玩家当boss
            } // 游戏没开始前,禁止即死
            return kplayers.filter((q) => {
                if (!q) {
                    return false;
                }
                if (lib.config.mode == 'boss' && q.bosskangxing && q.hp <= 0) {
                    return false;
                }
                return true;
            });
        },
        get dead() {
            if (!_status.gameStarted) {
                return [];
            } // 游戏没开始前,不进行击杀
            return kdead;
        },
    };
    Reflect.defineProperty(game, 'players', {
        get() {
            allplayers = [...new Set([...allplayers.filter((player) => !obj.dead.includes(player)), ...obj.players])];
            if (lib.config.extension_火灵月影_斩杀测试 && _status.gameStarted && !allplayers.length) {
                game.over('人已经死光了');
            } //斩杀测试
            return new Proxy(allplayers, {
                set(target, property, value) {
                    const result = Reflect.set(target, property, value); //先执行移除,不然里面有个undefined元素
                    if (property === 'length') {
                        game.sort();
                    }
                    return result; //不能与上面合并
                }, //防代理,但是不防前面的代理,如果放第一位,那么前面添加player就不会被set方法检测到
            }); //直接赋值不会触发set方法
        },
        configurable: false,
        set(value) {
            allplayers = value;
        },
    }); //锁定玩家列表
    let alldead = [];
    const kdead = [];
    Reflect.defineProperty(game, 'dead', {
        get() {
            alldead = [...new Set([...alldead.filter((player) => !obj.players.includes(player)), ...obj.dead])];
            return new Proxy(alldead, {
                set(target, property, value) {
                    const result = Reflect.set(target, property, value); //先执行移除,不然里面有个undefined元素
                    if (property === 'length') {
                        game.sort();
                    }
                    return result; //不能与上面合并
                },
            }); //直接赋值不会触发set方法
        },
        configurable: false,
        set(value) {
            alldead = value;
        },
    }); //锁定死亡列表
    //—————————————————————————————————————————————————————————————————————————————生成玩家时载入抗性
    const kname = new Map();
    let ocreateplayer = ui.create.player;
    const xcreateplayer = function (position, noclick) {
        const player = ocreateplayer(position, noclick);
        startplayers.push(player);
        let qname;
        Reflect.defineProperty(player, 'name', {
            get() {
                const real = kname.get(player);
                if (real) {
                    return real;
                } //这里不能调用obj.players会爆栈
                return qname;
            },
            set(v) {
                qname = v;
                if (lib.config.HL_kangxing.includes(v)) {
                    game.nkangxing(player, v); //先改名
                    game.skangxing(player);
                } else {
                    if (lib.config.extension_火灵月影_斩杀测试) {
                        game.HL_dead(player);
                    }
                }
            },
            configurable: false,
        });
        let hooktrigger = [];
        Reflect.defineProperty(player, '_hookTrigger', {
            get() {
                if (obj.players.includes(player)) {
                    return [];
                }
                return hooktrigger;
            },
            set(v) {
                hooktrigger = v;
            },
            configurable: false,
        });
        let remove = false;
        Reflect.defineProperty(player, 'removed', {
            get() {
                if (obj.players.includes(player)) {
                    return false;
                }
                return remove;
            },
            set(v) {
                remove = v;
            },
            configurable: false,
        });
        let qdis = {};
        Reflect.defineProperty(player, 'disabledSkills', {
            get() {
                if (obj.players.includes(player)) {
                    const kdis = {};
                    for (const i in qdis) {
                        kdis[i] = [];
                    }
                    qdis = kdis;
                    return qdis;
                }
                return qdis;
            },
            set(v) {
                qdis = v;
            },
            configurable: false,
        });
        let qstorage = {};
        Reflect.defineProperty(player, 'storage', {
            get() {
                if (obj.players.includes(player)) {
                    if (player.name == 'HL_许劭') {
                        return new Proxy(qstorage, {
                            get(u, i) {
                                if (i == 'skill_blocker') return [];
                                if (i.startsWith('temp_ban_')) return false;
                                if (['nohp', 'norecover'].includes(i)) return false;
                                if (!(i in u) && !i.startsWith('_') && !['东皇钟', 'jiu'].includes(i)) {
                                    return [
                                        [[], []],
                                        [[], []],
                                    ];
                                }
                                return u[i];
                            },
                        });
                    } //用hasskill会爆栈
                    return new Proxy(qstorage, {
                        get(u, i) {
                            if (i == 'skill_blocker') return [];
                            if (i.startsWith('temp_ban_')) return false;
                            return u[i];
                        },
                    });
                }
                return qstorage;
            },
            set(v) {
                qstorage = v;
            },
            configurable: false,
        });
        const list = ['button' /*武将包展示*/, 'selectable' /*可选择目标*/, 'selected' /*已选择目标*/, 'targeted' /*目标*/, 'selecting' /*正在选择目标*/, 'player' /*在场角色*/, 'fullskin' /*立绘*/, 'bossplayer' /*boss列表*/, 'highlight' /*高光*/, 'glow_phase' /*当前回合*/, 'd-skin' /*动皮下的静皮透明度*/];
        let classlist = player.classList;
        Reflect.defineProperty(player, 'classList', {
            get() {
                if (obj.players.includes(player)) {
                    return {
                        add(...args) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            for (const i of args) {
                                if (!classq.includes(i) && list.includes(i)) {
                                    classq.push(i);
                                }
                            }
                            qsetstyle.call(player, 'class', classq.join(' ').trim());
                        },
                        remove(...args) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            const classx = classq.filter((i) => !args.includes(i));
                            qsetstyle.call(player, 'class', classx.join(' ').replace(/^\s+|\s+$/g, ''));
                        },
                        toggle(name) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            if (classq.includes(name)) {
                                player.classList.remove(name);
                            } else {
                                player.classList.add(name);
                            }
                        },
                        contains(name) {
                            if (ui.restart) {
                                ui.restart.remove();
                            } //重新开始按钮
                            player.node.hp.classList.remove('hidden'); //隐藏体力条
                            player.node.avatar.style.transform = ''; //翻转
                            player.node.avatar.style.filter = ''; //黑白滤镜
                            player.style.transform = ''; //翻转
                            player.style.filter = ''; //黑白滤镜
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            for (const style of classq) {
                                if (!list.includes(style)) {
                                    player.classList.remove(style);
                                }
                            }
                            return list.includes(name) && classq.includes(name);
                        },
                    };
                }
                if (obj.dead.includes(player)) {
                    return {
                        add(...args) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            for (const i of args) {
                                if (!classq.includes(i)) {
                                    classq.push(i);
                                }
                            }
                            qsetstyle.call(player, 'class', classq.join(' ').trim());
                        },
                        remove(...args) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            const classx = classq.filter((i) => !args.includes(i) || !list.includes(i));
                            qsetstyle.call(player, 'class', classx.join(' ').replace(/^\s+|\s+$/g, ''));
                        },
                        toggle(name) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            if (classq.includes(name)) {
                                player.classList.remove(name);
                            } else {
                                player.classList.add(name);
                            }
                        },
                        contains(name) {
                            player.style.transform = 'rotate(20deg)';
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            if (!classq.includes('dead')) {
                                player.classList.add('dead');
                            }
                            return classq.includes(name) || !list.includes(name);
                        },
                    };
                }
                return classlist;
            },
            set(v) {
                classlist = v;
            },
            configurable: false,
        });
        Reflect.defineProperty(player, 'uninit', {
            get() {
                return function () {
                    try {
                        delete this.name;
                    } catch (e) {
                        console.log(this.name, e);
                    }
                    delete this.name1;
                    delete this.tempname;
                    delete this.skin;
                    delete this.sex;
                    delete this.group;
                    delete this.hp;
                    delete this.maxHp;
                    delete this.hujia;
                    if (this.name2) {
                        delete this.singleHp;
                        delete this.name2;
                    }
                    this.skipList = [];
                    this.clearSkills(true);
                    this.initedSkills = [];
                    this.additionalSkills = {};
                    this.disabledSkills = {};
                    this.hiddenSkills = [];
                    this.awakenedSkills = [];
                    this.forbiddenSkills = {};
                    this.phaseNumber = 0;
                    this.stat = [{ card: {}, skill: {} }];
                    this.tempSkills = {};
                    this.storage = {};
                    this.marks = {};
                    this.expandedSlots = {};
                    this.disabledSlots = {};
                    this.ai = { friend: [], enemy: [], neutral: [] };
                    this.$uninit();
                    return this;
                };
            },
            set() { },
            configurable: false,
        });
        Reflect.defineProperty(player, 'isAlive', {
            get() {
                return function () {
                    if (obj.players.includes(player)) {
                        return true;
                    }
                    if (obj.dead.includes(player)) {
                        return false;
                    }
                    return !this.classList.contains('dead');
                };
            },
            set() { },
            configurable: false,
        });
        Reflect.defineProperty(player, 'isDead', {
            get() {
                return function () {
                    if (obj.players.includes(player)) {
                        return false;
                    }
                    if (obj.dead.includes(player)) {
                        return true;
                    }
                    return this.classList.contains('dead');
                };
            },
            set() { },
            configurable: false,
        });
        Reflect.defineProperty(player, 'isIn', {
            get() {
                return function () {
                    if (obj.players.includes(player)) {
                        return true;
                    }
                    if (obj.dead.includes(player)) {
                        return false;
                    }
                    return !this.classList.contains('dead') && !this.classList.contains('out') && !this.removed;
                };
            },
            set() { },
            configurable: false,
        });
        return player;
    };
    Reflect.defineProperty(ui.create, 'player', {
        get() {
            return xcreateplayer;
        },
        set(v) {
            if (v != xcreateplayer) {
                ocreateplayer = v;
            }
        },
        configurable: false,
    }); //生成玩家时载入抗性
    //—————————————————————————————————————————————————————————————————————————————锁定技能与钩子
    let allskill = lib.skill;
    const kskill = {};
    Reflect.defineProperty(lib, 'skill', {
        get() {
            return new Proxy(allskill, {
                get(u, i) {
                    if (i in kskill) {
                        return Object.assign({}, kskill[i]);
                    }
                    return u[i];
                },
            });
        },
        set(v) {
            allskill = v;
        },
        configurable: false,
    }); //只能记录加载名字那一刻的技能,在之前被别人置空无解,除非直接按第一次赋值的来
    let allhook = lib.hook;
    const khook = {};
    Reflect.defineProperty(lib, 'hook', {
        get() {
            return new Proxy(allhook, {
                get(u, i) {
                    if (i in khook) {
                        if (Array.isArray(u[i])) {
                            u[i] = [...new Set([...u[i], ...khook[i]])];
                        } else {
                            u[i] = khook[i].slice();
                        }
                        if (khook[i].some((hook) => !u[i].includes(hook))) {
                            return khook[i].slice();
                        }
                    }
                    return u[i];
                },
            });
        },
        set(v) {
            allhook = v;
        },
        configurable: false,
    }); //之前加入和之前技能共用时机的新技能或者when技能会没有hook,现在可以加但是新加的锁不了,除非重构_hook使其按map角色存储hook
    //—————————————————————————————————————————————————————————————————————————————游戏内载入抗性函数
    const ktempSkills = new Map();
    Reflect.defineProperty(game, 'skangxing', {
        get() {
            return function (player, skills, remove) {
                if (player.playerid) {
                    if (!skills) {
                        skills = lib.character[player.name].skills.slice();
                    }
                    game.expandSkills(skills);
                    if (!ktempSkills.has(player)) {
                        ktempSkills.set(player, {});
                    }
                    const tempskill = ktempSkills.get(player);
                    if (remove) {
                        game.expandSkills(remove);
                        for (const skill of remove) {
                            if (tempskill[skill]) {
                                delete tempskill[skill];
                            }
                        }
                    }
                    for (const skill of skills) {
                        tempskill[skill] = 'QQQ';
                        if (!kskill[skill]) {
                            kskill[skill] = lib.skill[skill];
                        }
                        const trigger = lib.skill[skill].trigger;
                        for (const i in trigger) {
                            if (typeof trigger[i] == 'string') {
                                trigger[i] = [trigger[i]];
                            }
                            if (Array.isArray(trigger[i])) {
                                for (const j of trigger[i]) {
                                    const key = `${player.playerid}_${i}_${j}`;
                                    if (!khook[key]) {
                                        khook[key] = [];
                                    }
                                    khook[key].add(skill); //之前直接全加进去太离谱了
                                }
                            }
                        }
                    }
                    let qtemp = player.tempSkills || {};
                    Reflect.defineProperty(player, 'tempSkills', {
                        get() {
                            Object.assign(qtemp, tempskill);
                            return qtemp;
                        },
                        set(v) {
                            qtemp = v;
                        },
                        configurable: false,
                    }); //只加了技能和hook,但是没init
                }
            };
        },
        set() { },
        configurable: false,
    }); //临时技能锁定,技能钩子锁定,lib.skill锁定
    Reflect.defineProperty(game, 'nkangxing', {
        get() {
            return function (player, name) {
                if (player.playerid) {
                    if (!name) {
                        name = player.name;
                    }
                    game.log(player, '加入抗性');
                    kplayers.add(player);
                    kname.set(player, name);
                    const list = ['button', 'selectable', 'selected', 'targeted', 'selecting', 'player', 'fullskin', 'bossplayer', 'highlight', 'glow_phase'];
                    new MutationObserver(function () {
                        if (obj.players.includes(player)) {
                            if (ui.restart) {
                                ui.restart.remove();
                            } //重新开始按钮
                            player.node.hp.classList.remove('hidden'); //隐藏体力条
                            player.node.avatar.style.transform = ''; //翻转
                            player.node.avatar.style.filter = ''; //黑白滤镜
                            player.style.transform = ''; //翻转
                            player.style.filter = ''; //黑白滤镜
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            for (const style of classq) {
                                if (!list.includes(style)) {
                                    player.classList.remove(style);
                                }
                            }
                        }
                    }).observe(player, {
                        attributes: true,
                        attributeFilter: ['class'],
                    });
                }
            };
        },
        set() { },
        configurable: false,
    }); //名字抗性加入,类列表节点监听
    Reflect.defineProperty(game, 'HL_dead', {
        get() {
            return function (player) {
                if (player.playerid) {
                    game.log(player, '挂掉了');
                    kdead.push(player);
                    new MutationObserver(function () {
                        if (obj.dead.includes(player)) {
                            const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                            if (!classq.includes('dead')) {
                                player.classList.add('dead');
                                player.style.transform = 'rotate(20deg)';
                            }
                        }
                    }).observe(player, {
                        attributes: true,
                        attributeFilter: ['class'],
                    });
                }
            };
        },
        set() { },
        configurable: false,
    }); //斩杀测试
    //—————————————————————————————————————————————————————————————————————————————可有可无的部分,但是防止某些人强制胜利就自以为赢了
    let ocheckresult = game.checkResult;
    const xcheckresult = function () {
        if (obj.players.some((q) => q.getEnemies().length)) return;
        return ocheckresult();
    };
    Reflect.defineProperty(game, 'checkResult', {
        get() {
            return xcheckresult;
        },
        set(v) {
            if (v != xcheckresult) {
                ocheckresult = v;
            }
        },
        configurable: false,
    }); //禁止强制结束游戏
    Reflect.defineProperty(_status, 'over', {
        get() {
            return _status.pauseManager.over.isStarted;
        },
        set(v) {
            if (v) {
                if (obj.players.some((q) => q.getEnemies().length)) {
                    if (!_status.auto) {
                        ui.click.auto();
                    } //托管
                    setTimeout(function () {
                        const elements = document.querySelectorAll('.dialog.scroll1.scroll2');
                        elements.forEach((el) => {
                            el.remove();
                        }); //移除结算框
                        while (ui.control.firstChild) {
                            ui.control.firstChild.remove();
                        } //移除重开再战按钮
                    }, 500);
                } else {
                    _status.pauseManager.over.start();
                }
            } else {
                _status.pauseManager.over.resolve();
            }
        },
        configurable: false,
    }); //禁止强制结束游戏
    lib.arenaReady.push(function () {
        new MutationObserver(function () {
            for (const player of obj.players) {
                if (ui.arena.contains(player)) continue;
                console.log('还原角色被删除的武将牌');
                ui.arena.appendChild(player);
            }
        }).observe(ui.arena, {
            childList: true,
        });
        new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                mutation.addedNodes.forEach((node) => {
                    const string = node.innerHTML;
                    for (const player of obj.players) {
                        if (string.includes(`${get.translation(player)}</span>被`) || string.includes(`${get.translation(player)}</span>阵亡`)) {
                            node.remove();
                        }
                    }
                });
            }
        }).observe(ui.sidebar, {
            childList: true,
        });
        new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                mutation.addedNodes.forEach((node) => {
                    const string = node.innerHTML;
                    for (const player of obj.players) {
                        if (string.includes(`${get.translation(player)}</span>被`) || string.includes(`${get.translation(player)}</span>阵亡`)) {
                            node.remove();
                        }
                    }
                });
            }
        }).observe(ui.arenalog, {
            childList: true,
        });
    }); //禁止弹出死亡播报
};
kangxing1();
//—————————————————————————————————————————————————————————————————————————————抗性地狱
const kangxing2 = function () {
    //醉诗
    //每回合限两次,每轮开始时、体力变化后,你视为使用一张<酒>并随机使用牌堆中一张伤害牌,你随机使用弃牌堆或处理区中一张伤害牌
    Reflect.defineProperty(lib.skill, '醉诗', {
        get() {
            return {
                init(player) {
                    if (player == game.me) {
                        game.playAudio('../extension/火灵月影/audio/醉诗2.mp3');
                        game.HL_mp4('HL_李白');
                    } //李白动画
                },
                trigger: {
                    player: ['changeHp'],
                    global: ['roundStart'],
                },
                forced: true,
                usable: 2, //AAA
                audio: 'ext:火灵月影/audio:32',
                async content(event, trigger, player) {
                    let count = Math.min(numberq1(trigger.num), 9);
                    while (count-- > 0) {
                        if (Math.random() < 0.6) {
                            player.node.avatar.style.backgroundImage = `url(extension/火灵月影/image/HL_李白.jpg)`;
                            ui.background.setBackgroundImage('extension/火灵月影/image/HL_李白4.jpg');
                        } else {
                            player.node.avatar.setBackgroundImage('extension/火灵月影/image/HL_李白2.jpg');
                            ui.background.setBackgroundImage('extension/火灵月影/image/HL_李白3.jpg');
                        }
                        await player.quseCard('jiu', [player]);
                        for (const bool of [true, false]) {
                            const cards = bool ? Array.from(ui.cardPile.childNodes) : Array.from(ui.discardPile.childNodes).concat(Array.from(ui.ordering.childNodes));
                            const card = cards.filter((q) => get.tag(q, 'damage') || get.tag(q, 'recover')).randomGet();
                            if (card) {
                                game.log(`<span class="greentext">${get.translation(player)}${bool ? '醉酒狂诗' : '青莲剑仙'}${get.translation(card)}</span>`);
                                const enemy = player.getEnemies();
                                if (get.tag(card, 'recover')) {
                                    player.maxHp++;
                                    player.hp++;
                                    count++;
                                } else {
                                    await player.quseCard(card, enemy);
                                }
                            }
                        }
                    }
                },
                ai: {
                    maixie: true,
                    unequip: true,
                },
                group: ['bossfinish'],
            };
        },
        set() { },
        configurable: false,
    });
    HL.PJban = {
        trigger: [], //每回合每个时机限一次
        skill: [
            //卡死
            'ywuhun',
            'lsns_wuliang',
            //发动频率过高
            'xinfu_pdgyingshi',
            'clanguixiang',
            'qiaobian',
            'sbqiaobian',
            'rgxkuangcao',
            'Grand_chuanqi',
            'sksn_dieying',
            'white_gqliangyi',
            'xinzhizheng',
            //没标记或不满足条件
            'xingwu',
            'sbjieyin',
            'sbenyuan',
            'tiandan',
            'jsrgwuchang',
            'rehuashen',
            'huashen',
            'dccuixin',
            'jsrgzhengyi',
            'yijin',
            'tgtt_junzhu',
            'jiebing',
            'nzry_zhizheng',
            'dcjichou',
            'sksn_yinxian',
            'funie_chuli',
            'llbz_huanmeng',
            'llbz_huanhua',
            'llbz_enyuan',
            'North_dc_ziman',
            'sksn_jinian',
            'xx_zhipei',
            'wufei',
            'dczixi',
            'yjyongquan',
            'mbbojian',
            'leiyu',
            'dqzw_fuzhou',
            //负面技能
            'misuzu_hengzhou',
            'iwasawa_mysong',
            'yxs_menshen',
            'chengmou',
            'twbaobian',
            'boss_hunyou',
            'Grand_LausSaintClaudius',
            'sksn_jianyu',
            'sksn_wenshi',
            'DIY_chaoxi',
            'chuli_fuze_gain',
            'North_yhy_cihua',
            'haoshi',
            'olhaoshi',
            'sksn_yunjing',
            //火灵月影
            'HL_pingjian',
            'HL_pingjian_player',
            'HL_pingjian_target',
            'HL_pingjian_source',
            'HL_pingjian_global',
            '阵亡',
            '贵相',
            '醉诗',
            '测试',
        ], //每局游戏每个技能限一次
    };
    for (const namex of ['player', 'global', 'source', 'target']) {
        Reflect.defineProperty(lib.skill, `HL_pingjian_${namex}`, {
            get() {
                return {
                    get trigger() {
                        if (!game.triggerlist) {
                            const triggerlist = {
                                player: {},
                                global: {},
                                source: {},
                                target: {},
                            };
                            for (const i in lib.skill) {
                                const info = lib.skill[i];
                                if (info.trigger && lib.translate[`${i}_info`]) {
                                    for (const j in info.trigger) {
                                        const trigger1 = info.trigger[j];
                                        const trigger2 = triggerlist[j];
                                        if (trigger2) {
                                            if (Array.isArray(trigger1)) {
                                                for (const x of trigger1) {
                                                    trigger2[x] = numberq0(trigger2[x]) + 1;
                                                }
                                            } else if (typeof trigger1 == 'string') {
                                                trigger2[trigger1] = numberq0(trigger2[trigger1]) + 1;
                                            }
                                        }
                                    }
                                }
                            }
                            for (const target in triggerlist) {
                                const info = triggerlist[target];
                                for (const name in info) {
                                    if (info[name] < 5) {
                                        delete info[name];
                                    }
                                }
                            }
                            game.triggerlist = {
                                player: Object.keys(triggerlist.player),
                                global: Object.keys(triggerlist.global),
                                source: Object.keys(triggerlist.source),
                                target: Object.keys(triggerlist.target),
                            };
                        }
                        return {
                            [namex]: game.triggerlist[namex],
                        };
                    },
                    forced: true,
                    popup: false,
                    filter(event, player, namey) {
                        if (HL.PJban.trigger.includes(`${namex}·${namey}`)) {
                            return false;
                        }
                        const skills = Object.keys(lib.skill).filter((i) => {
                            const infox = lib.skill[i];
                            if (lib.translate[`${i}_info`] && !HL.PJban.skill.includes(i) && infox.trigger) {
                                const triggerx = infox?.trigger[namex];
                                if (Array.isArray(triggerx)) {
                                    return triggerx.includes(namey);
                                }
                                return triggerx == namey;
                            }
                        });
                        return skills.length;
                    },
                    async content(event, trigger, player) {
                        const namey = event.triggername;
                        const skills = Object.keys(lib.skill).filter((i) => {
                            const infox = lib.skill[i];
                            if (lib.translate[`${i}_info`] && !HL.PJban.skill.includes(i) && infox.trigger) {
                                const triggerx = infox?.trigger[namex];
                                if (Array.isArray(triggerx)) {
                                    return triggerx.includes(namey);
                                }
                                return triggerx == namey;
                            }
                        });
                        HL.PJban.trigger.push(`${namex}·${namey}`);
                        game.log(`<b style='color:rgb(228, 17, 28);'>评鉴触发时机·${namex}·${namey}</b>`);
                        if (skills.length) {
                            const list = skills.randomGets(3);
                            const {
                                result: { control },
                            } = await player
                                .chooseControl(list)
                                .set(
                                    'choiceList',
                                    list.map(function (i) {
                                        return `<div class='skill'><${get.translation(i)}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                    })
                                )
                                .set('displayIndex', false)
                                .set('prompt', `评鉴·${namex}·${namey}:请选择发动的技能`);
                            HL.PJban.skill.push(control);
                            game.log(`<b style='color:rgb(17, 228, 69);'>评鉴发动技能·${control}</b>`);
                            await game.delay(2);
                            const triggershuju = function () {
                                if (!trigger.source) {
                                    trigger.source = player.getEnemies().randomGet();
                                }
                                if (!trigger.targets) {
                                    trigger.targets = player.getEnemies();
                                }
                                if (!trigger.target) {
                                    trigger.target = trigger.targets[0];
                                }
                                if (!trigger.cards || !trigger.cards[0]) {
                                    trigger.cards = get.cards(3);
                                }
                                if (!trigger.card) {
                                    trigger.card = new lib.element.VCard(trigger.cards[0], trigger.cards);
                                }
                                if (!trigger.num) {
                                    trigger.num = 1;
                                }
                                if (!trigger.skill) {
                                    trigger.skill = 'HL_pingjian';
                                }
                                if (!trigger.sourceSkill) {
                                    trigger.sourceSkill = 'HL_pingjian';
                                }
                                if (!trigger.respondTo || !trigger.respondTo[0]) {
                                    trigger.respondTo = [trigger.source, trigger.card];
                                }
                                if (!trigger.excluded) {
                                    trigger.excluded = [player];
                                }
                            };
                            triggershuju();
                            const runevent = async function (skillx) {
                                const infox = lib.skill[skillx];
                                if (infox.init) {
                                    infox.init(player, skillx);
                                }
                                let indexedData, targets;
                                if (typeof infox.getIndex === 'function') {
                                    indexedData = infox.getIndex(trigger, player, namey);
                                }
                                if (typeof infox.logTarget === 'string') {
                                    targets = trigger[infox.logTarget];
                                } else if (typeof infox.logTarget === 'function') {
                                    targets = infox.logTarget(trigger, player, namey, indexedData);
                                }
                                if (get.itemtype(targets) === 'player') {
                                    targets = [targets];
                                }
                                let result;
                                if (typeof infox.cost === 'function') {
                                    const next = game.createEvent(`${skillx}_cost`, false);
                                    next.skill = skillx;
                                    next.player = player;
                                    next._trigger = trigger;
                                    next.triggername = namey;
                                    result = await next.setContent(infox.cost).forResult();
                                    if (result && result.bool) {
                                    } else {
                                        return;
                                    } //cost没通过就返回
                                }
                                const next = game.createEvent(skillx, false);
                                next.skill = skillx;
                                next.player = player;
                                next._trigger = trigger;
                                next.triggername = namey;
                                if (targets?.length) {
                                    next.targets = targets;
                                } //先logtarget
                                if (indexedData) {
                                    next.indexedData = indexedData;
                                }
                                if (result && result.bool) {
                                    if (result.cards?.length) {
                                        next.cards = result.cards;
                                    }
                                    if (result.targets?.length) {
                                        next.targets = result.targets;
                                    }
                                    if (result.cost_data) {
                                        next.cost_data = result.cost_data;
                                    }
                                } //再载入cost的结果
                                if (!next.cards) {
                                    next.cards = get.cards();
                                }
                                if (!next.targets) {
                                    next.targets = player.getEnemies();
                                }
                                if (!next.target) {
                                    next.target = next.targets[0];
                                }
                                await next.setContent(infox.content);
                            };
                            const start = game.expandSkills([control]);
                            for (const skillx of start) {
                                const infox = lib.skill[skillx];
                                if (infox?.trigger?.player) {
                                    if (typeof infox.trigger.player == 'string') {
                                        infox.trigger.player = [infox.trigger.player];
                                    }
                                    if (['enterGame', 'gameStart'].some((tri) => infox.trigger.player.includes(tri))) {
                                        game.log(skillx + '是游戏开始时技能');
                                        await runevent(skillx);
                                    }
                                }
                            }
                            await runevent(control);
                        }
                    },
                    _priority: 20,
                };
            },
            set() { },
            configurable: false,
        });
    }
    Reflect.defineProperty(lib.skill, 'HL_pingjian', {
        get() {
            return {
                init(player) {
                    player.getExpansions = function () {
                        return get.cards(3);
                    };
                    player.addToExpansion = function () {
                        const card = get.cards()[0];
                        player.gain(card, 'gain2');
                        return card;
                    };
                },
                trigger: {
                    global: ['phaseAfter'],
                },
                forced: true,
                async content(event, trigger, player) {
                    HL.PJban.trigger = [];
                },
                group: ['bossfinish', 'HL_pingjian_player', 'HL_pingjian_target', 'HL_pingjian_source', 'HL_pingjian_global'],
            };
        },
        set() { },
        configurable: false,
    });
};
kangxing2();
//—————————————————————————————————————————————————————————————————————————————boss模式相关函数,目前改用代理来排序
const boss = function () {
    lib.skill._sort = {
        trigger: {
            player: ['phaseEnd'],
        },
        silent: true,
        forceDie: true,
        forceOut: true,
        filter() {
            game.sort();
        },
        content() { },
    }; //排座位
    let _me;
    Reflect.defineProperty(game, 'me', {
        get() {
            return _me;
        },
        set(v) {
            _me = v;
            if (game.players.includes(v) && game.players[0] != v) {
                game.sort(); //因为李白最先进入players,挑战模式不管选什么挑战李白,都会变成game.me是李白
            } //如果数组target[meIndex]是李白,那么替换掉的一瞬间,接下来调用就会再添加一个李白,导致数组两个李白
        }, //更换game.me之后第一时间排序
    });
    game.sort = function () {
        const players = game.players.filter(Boolean);
        const deads = game.dead.filter(Boolean);
        const allPlayers = deads.concat(players); //先移除players后面玩家会前移,再添加入dead需要同排序取前
        const bool = lib.config.dieremove;
        const playerx = bool ? players : allPlayers;
        ui.arena.setNumber(playerx.length);
        if (bool) {
            deads.forEach((player) => {
                player.classList.add('removing', 'hidden');
            });
        } //隐藏死亡角色
        playerx.sort((a, b) => Number(a.dataset.position) - Number(b.dataset.position));
        if (playerx.includes(game.me) && playerx[0] != game.me) {
            while (playerx[0] != game.me) {
                const start = playerx.shift();
                playerx.push(start);
            }
        } //将玩家排至数组首位
        playerx.forEach((player, index, array) => {
            player.dataset.position = index;
            const zhu = _status.roundStart || game.zhu || game.boss || array.find((p) => p.seatNum == 1) || array[0];
            const zhuPos = Number(zhu.dataset.position);
            const num = index - zhuPos + 1;
            if (index < zhuPos) {
                player.seatNum = players.length - num;
            } else {
                player.seatNum = num;
            }
        }); //修改dataset.position与seatNum
        players.sort((a, b) => Number(a.dataset.position) - Number(b.dataset.position));
        players.forEach((player, index, array) => {
            if (bool) {
                player.classList.remove('removing', 'hidden');
            }
            if (index == 0) {
                if (ui.handcards1Container && ui.handcards1Container.firstChild != player.node.handcards1) {
                    while (ui.handcards1Container.firstChild) {
                        ui.handcards1Container.firstChild.remove();
                    }
                    ui.handcards1Container.appendChild(player.node.handcards1.addTempClass('start').fix());
                }
                if (game.me != player) {
                    ui.updatehl();
                }
            }
            player.previous = array[index === 0 ? array.length - 1 : index - 1];
            player.next = array[index === array.length - 1 ? 0 : index + 1];
        }); //展示零号位手牌/修改previous/显示元素
        allPlayers.sort((a, b) => Number(a.dataset.position) - Number(b.dataset.position));
        allPlayers.forEach((player, index, array) => {
            player.previousSeat = array[index === 0 ? array.length - 1 : index - 1];
            player.nextSeat = array[index === array.length - 1 ? 0 : index + 1];
        }); //修改previousSeat
        game.players.sort((a, b) => Number(a.dataset.position) - Number(b.dataset.position));
        return true;
    };
    game.players = new Proxy([], {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            if (property === 'length') {
                game.sort();
            }
            return result;
        },
    });
    game.dead = new Proxy([], {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            if (property === 'length') {
                game.sort();
            }
            return result;
        },
    });
    game.kongfunc = function () {
        return game.kong;
    };
    game.kong = {
        set() {
            return this;
        },
        get player() {
            return game.me;
        }, //先声明后赋值的,后面调用会是underfined,所以用getter实时获取
        cards: [],
        result: {
            cards: [],
        },
        gaintag: [],
        forResult() { },
    };
    game.changeBossQ = function (name) {
        _status.event.forceDie = true;
        const boss = game.addPlayerQ(name);
        boss.side = true;
        if (game.additionaldead) {
            game.additionaldead.push(game.boss);
        } else {
            game.additionaldead = [game.boss];
        }
        boss.setIdentity('zhu');
        boss.identity = 'zhu';
        const player = game.boss;
        game.boss = boss;
        game.addVideo('bossSwap', player, '_' + boss.name);
        if (game.me == player) {
            game.swapControl(boss);
        }
        return boss;
    };
    game.addPlayerQ = function (name) {
        const player = ui.create.player(ui.arena).addTempClass('start');
        player.getId();
        if (name) player.init(name);
        game.players.push(player);
        player.draw(Math.min(player.maxHp, 20));
        return player;
    };
    lib.element.player.addFellow = function (name) {
        const npc = game.addPlayerQ(name);
        this.guhuo(npc);
        return npc;
    }; //添加随从
    lib.element.player.guhuo = function (target) {
        target.side = this.side;
        let identity = this.identity;
        if (this.identity == 'zhu') {
            identity = 'zhong';
        } // 挑战模式多个主身份,会导致boss多个回合
        target.identity = identity;
        target.setIdentity(identity, 'blue');
        target.boss = this;
        target.ai.modAttitudeFrom = function (from, to, att) {
            //这里from是本人
            if (to == from.boss) return 99;
            return att;
        };
        target.ai.modAttitudeTo = function (from, to, att) {
            //这里to是本人
            if (to.boss == from) return 99;
            return att;
        };
        return target;
    }; //令一名角色服从你
};
boss();
const extensionInfo = await lib.init.promises.json(`extension/火灵月影/info.json`);
game.import('extension', function (lib, game, ui, get, ai, _status) {
    return {
        name: '火灵月影',
        arenaReady() {
            ui.create.system(
                '火灵月影',
                async function () {
                    const div = document.createElement('div');
                    div.id = 'divQ';
                    const remove = [];
                    //————————————————————————————————————————————————————————重置设置
                    const chongzhi = document.createElement('div');
                    chongzhi.className = 'chongzhiQ';
                    chongzhi.innerHTML = '重置';
                    chongzhi.onclick = function () {
                        game.saveConfig('HL_kangxing', ['HL_李白', 'HL_许劭', 'HL_kangxing']);
                    };
                    remove.add(chongzhi);
                    document.body.appendChild(chongzhi);
                    //————————————————————————————————————————————————————————确定
                    const OK = document.createElement('div');
                    OK.className = 'backQ';
                    OK.innerHTML = '确定';
                    OK.onclick = function () {
                        if (div.log) {
                            const name = div.log.link;
                            lib.config.HL_kangxing.add(name);
                            game.saveConfig('HL_kangxing', lib.config.HL_kangxing);
                            const npc = game.players.find((q) => q.name == name);
                            if (npc) {
                                game.skangxing(npc);
                                game.nkangxing(npc, name);
                            }
                        }
                        for (const i of remove) {
                            i.remove();
                        }
                    };
                    remove.add(OK);
                    document.body.appendChild(OK);
                    //————————————————————————————————————————————————————————搜索
                    const input = document.createElement('input');
                    input.className = 'shuruQ';
                    const FIND = document.createElement('div');
                    FIND.className = 'findQ';
                    FIND.innerHTML = '搜索';
                    FIND.onclick = function () {
                        while (div.firstChild) {
                            div.firstChild.remove();
                        }
                        for (const j in lib.character) {
                            if ((lib.translate[j] && lib.translate[j].includes(input.value)) || j.includes(input.value)) {
                                const JUESE = document.createElement('div');
                                div.appendChild(JUESE);
                                JUESE.setBackground(j, 'character');
                                JUESE.className = 'characterQ';
                                JUESE.innerHTML = get.translation(j);
                                JUESE.link = j;
                                JUESE.onclick = function () {
                                    if (div.log) {
                                        div.log.classList.remove('selected');
                                    }
                                    div.log = this;
                                    this.classList.add('selected');
                                };
                            }
                        }
                    };
                    remove.add(FIND);
                    remove.add(input);
                    document.body.appendChild(FIND);
                    document.body.appendChild(input);
                    //————————————————————————————————————————————————————————武将列表
                    for (const i in lib.characterPack) {
                        const PACK = document.createElement('div');
                        PACK.className = 'packQ';
                        PACK.innerHTML = get.translation(i + '_character_config');
                        PACK.link = i;
                        PACK.onclick = function () {
                            while (div.firstChild) {
                                div.firstChild.remove();
                            }
                            for (const j in lib.characterPack[this.link]) {
                                const JUESE = document.createElement('div');
                                div.appendChild(JUESE);
                                JUESE.setBackground(j, 'character');
                                JUESE.className = 'characterQ';
                                JUESE.innerHTML = get.translation(j);
                                JUESE.link = j;
                                JUESE.onclick = function () {
                                    if (div.log) {
                                        div.log.classList.remove('selected');
                                    }
                                    div.log = this;
                                    this.classList.add('selected');
                                };
                            }
                        };
                        div.appendChild(PACK);
                    }
                    remove.add(div);
                    document.body.appendChild(div);
                },
                true
            ); //火灵月影
            if (lib.config.extension_火灵月影_扑克模式) {
                const list = [];
                for (const num of lib.number) {
                    for (const suit of lib.suit) {
                        list.push([suit, num, 'pukepai']);
                    }
                }
                list.push(['none', 14, 'pukepai']);
                list.push(['none', 15, 'pukepai']);
                Reflect.defineProperty(lib.card, 'list', {
                    get() {
                        return list.randomSort().slice(); //每次生成新数组,不加slice的话每次都是原数组,修改会被映射进去
                    },
                    configurable: false,
                    set() { },
                });
            }
        },
        content(config, pack) {
            get.vcardInfo = function (card) { }; //卡牌storage里面存了DOM元素会循环引用导致不能JSON.stringify
            game.addGroup('仙', `<img src="extension/火灵月影/other/xian.png"width="30"height="30">`, '仙', {
                color: ' #28e3ce',
                image: 'ext:火灵月影/other/xian.png',
            });
            game.addNature('snow', '雪', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            game.addNature('blood', '血', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            game.addNature('poison', '毒', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            game.addNature('gold', '金', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            game.addNature('water', '水', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            game.addNature('ScarletRot', '猩红腐败', {
                linked: true,
                order: 1000,
            }); //添加杀的属性
            for (const nature of Array.from(lib.nature.keys())) {
                lib.card.sha.ai.tag[nature + 'Damage'] = function (card) {
                    if (game.hasNature(card, nature)) {
                        return 1;
                    }
                };
                lib.card.sha.nature.add(nature);
            }
            lib.skill.bosshp = {
                init(player) {
                    const info = lib.character[player.name];
                    let maxhp = Math.max(info.maxHp, player.maxHp);
                    Reflect.defineProperty(player, 'maxHp', {
                        get() {
                            return maxhp;
                        },
                        set(value) {
                            if (value > maxhp) {
                                maxhp = value;
                            }
                        },
                    }); //扣减体力上限抗性
                    let qhp = Math.max(info.hp, player.hp);
                    Reflect.defineProperty(player, 'hp', {
                        get() {
                            return qhp;
                        },
                        set(value) {
                            if (value > qhp) {
                                qhp = value;
                            } else {
                                if (player.success) {
                                    qhp = value;
                                }
                            }
                        },
                    });
                    Reflect.defineProperty(player, 'skipList', {
                        get() {
                            return [];
                        },
                        set() { },
                    });
                },
                trigger: {
                    player: ['damageEnd'],
                },
                popup: false,
                firstDo: true,
                forced: true,
                charlotte: true,
                fixed: true,
                kangxing: true,
                filter(event, player) {
                    return event.num > 0;
                },
                async content(event, trigger, player) {
                    player.success = true;
                    player.hp = player.hp - trigger.num;
                    player.update();
                    player.success = false;
                },
            }; // 挂的主技能被封了也会跟着被封
            lib.skill.bossfinish = {
                trigger: {
                    source: ['damageBefore'],
                    player: ['useCardBefore', 'phaseBefore', 'phaseDrawBefore', 'phaseUseBefore'],
                },
                popup: false,
                firstDo: true,
                forced: true,
                async content(event, trigger, player) {
                    if (['phaseUse', 'damage'].includes(trigger.name)) {
                        Reflect.defineProperty(trigger, 'finished', {
                            get() {
                                return trigger.step > 5;
                            },
                            set() { },
                        });
                        let damage = trigger.num;
                        Reflect.defineProperty(trigger, 'num', {
                            get() {
                                return damage;
                            },
                            set(value) {
                                if (value > damage) {
                                    damage = value;
                                }
                            },
                        });
                        const npc = trigger.player;
                        Reflect.defineProperty(trigger, 'player', {
                            get() {
                                return npc;
                            },
                            set() { },
                        });
                    }
                    if (trigger.name == 'useCard') {
                        Reflect.defineProperty(trigger, 'finished', {
                            get() {
                                return trigger.step > 16;
                            },
                            set() { },
                        });
                        Reflect.defineProperty(trigger, 'excluded', {
                            get() {
                                return [];
                            },
                            set() { },
                        });
                        Reflect.defineProperty(trigger, 'all_excluded', {
                            get() {
                                return false;
                            },
                            set() { },
                        });
                        if (get.tag(trigger.card, 'damage')) {
                            const targets = player.getEnemies();
                            Reflect.defineProperty(trigger, 'targets', {
                                get() {
                                    return targets;
                                }, //用变量保存一下,防止杀死一名敌人之后targets数组变化导致漏过一个
                                set() { },
                            });
                        } //用牌击穿
                    }
                    if (trigger.name == 'phase') {
                        Reflect.defineProperty(trigger, 'finished', {
                            get() {
                                return trigger.step > 12;
                            },
                            set() { },
                        });
                        Reflect.defineProperty(trigger, 'player', {
                            get() {
                                return player;
                            },
                            set() { },
                        });
                    }
                },
            };
            lib.translate.bosshp = 'boss抗性';
            lib.translate.bosshp_info = '你的体力上限不会减少,免疫体力调整与体流';
            lib.translate.bossfinish = 'boss抗性';
            lib.translate.bossfinish_info = '你的阶段与回合不会被跳过,你造成的伤害不能被减免,你使用的牌不能被无效且伤害牌指定所有敌方角色';
            if (lib.boss) {
                for (const i of HL.boss) {
                    lib.boss[i] = {
                        chongzheng: false, //所有人死后几轮复活,填0不会复活//boss不会自动添加重整
                        checkResult(player) {
                            if (player == game.boss && player.hp > 0) {
                                return false;
                            }
                        },
                        init() {
                            game.nkangxing(game.boss, game.boss.name);
                            game.skangxing(game.boss);
                            game.boss.bosskangxing = true;
                        },
                    };
                }
                lib.skill._HL_ws_boss = {
                    trigger: {
                        player: 'dieEnd',
                    },
                    forced: true,
                    forceDie: true,
                    mode: ['boss'],
                    filter(event, player) {
                        return HL.HL_ws_boss?.boss.every((q) => !game.players.includes(q)) && HL.HL_ws_boss.num < 4;
                    },
                    async content(event, trigger, player) {
                        HL.HL_ws_boss.boss = [];
                        HL.HL_ws_boss.num++;
                        const list = HL.HL_ws_boss.name.randomGets(HL.HL_ws_boss.num);
                        let first;
                        for (const name of list) {
                            let bossx;
                            if (!first) {
                                first = true;
                                bossx = game.changeBossQ(name);
                            } else {
                                bossx = game.boss.addFellow(name);
                            }
                            HL.HL_ws_boss.boss.add(bossx);
                            bossx.skills = [];
                            const skills = lib.character[name].skills.slice(0, HL.HL_ws_boss.num);
                            if (lib.config.extension_火灵月影_lianyu) {
                                skills.add(lib.character[name].skills.slice(-1));
                            }
                            game.nkangxing(bossx, name);
                            game.skangxing(bossx, skills);
                            bossx.bosskangxing = true;
                        }
                    },
                };
                lib.boss.HL_ws_boss = {
                    chongzheng: false,
                    checkResult(player) {
                        if (HL.HL_ws_boss.num < 4 || HL.HL_ws_boss.boss.some((q) => game.players.includes(q))) {
                            if (player == game.boss) {
                                return false;
                            }
                        } else {
                            game.checkResult();
                        }
                    },
                    init() {
                        HL.HL_ws_boss = {
                            num: 1,
                            name: ['HL_liru', 'HL_jiaxu', 'HL_huaxiong', 'HL_lvbu'],
                            boss: [game.boss],
                        };
                        const name = HL.HL_ws_boss.name.randomGet();
                        game.boss.init(name);
                        game.boss.skills = [];
                        const skills = lib.character[name].skills.slice(0, HL.HL_ws_boss.num);
                        if (lib.config.extension_火灵月影_lianyu) {
                            skills.add(lib.character[name].skills.slice(-1));
                        }
                        game.nkangxing(game.boss, name);
                        game.skangxing(game.boss, skills);
                        game.boss.bosskangxing = true;
                    },
                };
                lib.skill._HL_libai_boss = {
                    trigger: {
                        player: ['dieEnd'],
                    },
                    forced: true,
                    forceDie: true,
                    mode: ['boss'],
                    filter(event, player) {
                        return HL.HL_libai_boss && HL.HL_libai_boss < 4 && game.boss == player;
                    },
                    async content(event, trigger, player) {
                        HL.HL_libai_boss++;
                        const name = `HL_libai${HL.HL_libai_boss}`;
                        const boss = game.changeBossQ(name);
                        game.nkangxing(boss, name);
                        game.skangxing(boss);
                        boss.bosskangxing = true;
                        const evt = _status.event.getParent('phase', true);
                        if (evt) {
                            evt.finish();
                        }
                        boss.phase('nodelay');
                    },
                };
                lib.boss.HL_libai_boss = {
                    chongzheng: false,
                    checkResult(player) {
                        if (player == game.boss && game.boss.name != 'HL_libai4') {
                            return false;
                        }
                    },
                    init() {
                        HL.HL_libai_boss = 1;
                        game.boss.init('HL_libai1');
                        game.nkangxing(game.boss, 'HL_libai1');
                        game.skangxing(game.boss);
                        game.boss.bosskangxing = true;
                    },
                };
            }
            if (lib.config.extension_火灵月影_关闭本体BOSS) {
                for (const i of ['boss_hundun', 'boss_qiongqi', 'boss_taotie', 'boss_taowu', 'boss_zhuyin', 'boss_xiangliu', 'boss_zhuyan', 'boss_bifang', 'boss_yingzhao', 'boss_qingmushilian', 'boss_qinglong', 'boss_mushengoumang', 'boss_shujing', 'boss_taihao', 'boss_chiyanshilian', 'boss_zhuque', 'boss_huoshenzhurong', 'boss_yanling', 'boss_yandi', 'boss_baimangshilian', 'boss_baihu', 'boss_jinshenrushou', 'boss_mingxingzhu', 'boss_shaohao', 'boss_xuanlinshilian', 'boss_xuanwu', 'boss_shuishengonggong', 'boss_shuishenxuanming', 'boss_zhuanxu', 'boss_zhuoguiquxie', 'boss_nianshou_heti', 'boss_nianshou_jingjue', 'boss_nianshou_renxing', 'boss_nianshou_ruizhi', 'boss_nianshou_baonu', 'boss_baiwuchang', 'boss_heiwuchang', 'boss_luocha', 'boss_yecha', 'boss_niutou', 'boss_mamian', 'boss_chi', 'boss_mo', 'boss_wang', 'boss_liang', 'boss_qinguangwang', 'boss_chujiangwang', 'boss_songdiwang', 'boss_wuguanwang', 'boss_yanluowang', 'boss_bianchengwang', 'boss_taishanwang', 'boss_dushiwang', 'boss_pingdengwang', 'boss_zhuanlunwang', 'boss_mengpo', 'boss_dizangwang', 'boss_lvbu1', 'boss_lvbu2', 'boss_lvbu3', 'boss_caocao', 'boss_guojia', 'boss_zhangchunhua', 'boss_zhenji', 'boss_liubei', 'boss_zhugeliang', 'boss_huangyueying', 'boss_pangtong', 'boss_zhouyu', 'boss_caiwenji', 'boss_zhangjiao', 'boss_zuoci', 'boss_diaochan', 'boss_huatuo', 'boss_dongzhuo', 'boss_sunce']) {
                    lib.config.mode_config.boss[`${i}_boss_config`] = false;
                }
                game.saveConfig(`mode_config`, lib.config.mode_config);
            }
            if (lib.config.extension_火灵月影_文字闪烁) {
                const style = document.createElement('style');
                style.innerHTML = '@keyframes QQQ{';
                for (var i = 1; i <= 20; i++) {
                    let rand1 = Math.floor(Math.random() * 255),
                        rand2 = Math.floor(Math.random() * 255),
                        rand3 = Math.floor(Math.random() * 255);
                    style.innerHTML += i * 5 + `%{text-shadow: black 0 0 1px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 2px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 5px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 10px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 10px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 20px,rgba(${rand1}, ${rand2}, ${rand3}, 0.6) 0 0 20px}`;
                }
                style.innerHTML += '}';
                document.head.appendChild(style);
            }
            if (lib.config.extension_火灵月影_武将全部可选) {
                Reflect.defineProperty(lib.filter, 'characterDisabled', {
                    get: () =>
                        function (i) {
                            return !lib.character[i];
                        },
                    set() { },
                }); //取消禁将
                lib.filter.characterDisabled2 = function (i) {
                    return !lib.character[i];
                }; //取消禁将
                get.gainableSkills = function (func, player) {
                    var list = [];
                    for (var i in lib.character) {
                        for (var j = 0; j < lib.character[i][3].length; j++) {
                            list.add(lib.character[i][3][j]);
                        }
                    }
                    return list;
                }; //BOSS选将
                get.gainableSkillsName = function (name, func) {
                    var list = [];
                    if (name && lib.character[name]) {
                        for (var j = 0; j < lib.character[name][3].length; j++) {
                            list.add(lib.character[name][3][j]);
                        }
                    }
                    return list;
                }; //BOSS选将
                Reflect.defineProperty(ui.create, 'characterDialog', {
                    get() {
                        return function () {
                            var filter, str, noclick, thisiscard, seperate, expandall, onlypack, heightset, precharacter, characterx;
                            for (var i = 0; i < arguments.length; i++) {
                                if (arguments[i] === 'thisiscard') {
                                    thisiscard = true;
                                } else if (arguments[i] === 'expandall') {
                                    expandall = true;
                                } else if (arguments[i] === 'heightset') {
                                    heightset = true;
                                } else if (arguments[i] == 'precharacter') {
                                    precharacter = true;
                                } else if (arguments[i] == 'characterx') {
                                    characterx = true;
                                } else if (typeof arguments[i] == 'string' && arguments[i].startsWith('onlypack:')) {
                                    onlypack = arguments[i].slice(9);
                                } else if (typeof arguments[i] == 'object' && typeof arguments[i].seperate == 'function') {
                                    seperate = arguments[i].seperate;
                                } else if (typeof arguments[i] === 'string') {
                                    str = arguments[i];
                                } else if (typeof arguments[i] === 'function') {
                                    filter = arguments[i];
                                } else if (typeof arguments[i] == 'boolean') {
                                    noclick = arguments[i];
                                }
                            }
                            var list = [];
                            const groups = [];
                            var dialog;
                            var node = ui.create.div('.caption.pointerspan');
                            if (get.is.phoneLayout()) {
                                node.style.fontSize = '30px';
                            }
                            var namecapt = [];
                            var getCapt = function (str) {
                                var capt;
                                if (str.indexOf('_') == -1) {
                                    capt = str[0];
                                } else {
                                    capt = str[str.lastIndexOf('_') + 1];
                                }
                                capt = capt.toLowerCase();
                                if (!/[a-z]/i.test(capt)) {
                                    capt = '自定义';
                                }
                                return capt;
                            };
                            if (thisiscard) {
                                for (var i in lib.card) {
                                    if (!lib.translate[`${i}_info`]) continue;
                                    if (filter && filter(i)) continue;
                                    list.push(['', get.translation(lib.card[i].type), i]);
                                    if (namecapt.indexOf(getCapt(i)) == -1) {
                                        namecapt.push(getCapt(i));
                                    }
                                }
                            } else {
                                var groupnum = {};
                                for (var i in lib.character) {
                                    list.push(i);
                                    if (get.is.double(i)) {
                                        groups.add('double');
                                    } else {
                                        const Q = lib.character[i][1];
                                        if (!groupnum[Q]) groupnum[Q] = 0;
                                        groupnum[Q]++;
                                        if (groupnum[Q] > 20) {
                                            groups.add(lib.character[i][1]);
                                        } //删除多余势力
                                    }
                                    if (namecapt.indexOf(getCapt(i)) == -1) {
                                        namecapt.push(getCapt(i));
                                    }
                                }
                            }
                            namecapt.sort(function (a, b) {
                                return a > b ? 1 : -1;
                            });
                            groups.sort(lib.sort.group);
                            if (!thisiscard) {
                                namecapt.remove('自定义');
                                namecapt.push('newline');
                                for (var i in lib.characterDialogGroup) {
                                    namecapt.push(i);
                                }
                            }
                            var newlined = false;
                            var newlined2;
                            var packsource;
                            var clickCapt = function (e) {
                                if (_status.dragged) return;
                                if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                                    dialog.currentcapt2 = null;
                                    dialog.currentcaptnode2.classList.remove('thundertext');
                                    dialog.currentcaptnode2.inited = true;
                                    dialog.currentcaptnode2 = null;
                                }
                                if (this.alphabet) {
                                    if (this.classList.contains('thundertext')) {
                                        dialog.currentcapt = null;
                                        dialog.currentcaptnode = null;
                                        this.classList.remove('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.remove('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentcaptnode) {
                                            dialog.currentcaptnode.classList.remove('thundertext');
                                            if (dialog.currentcaptnode.touchlink) {
                                                dialog.currentcaptnode.touchlink.classList.remove('active');
                                            }
                                        }
                                        dialog.currentcapt = this.link;
                                        dialog.currentcaptnode = this;
                                        this.classList.add('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.add('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    }
                                } else {
                                    if (newlined2) {
                                        newlined2.style.display = 'none';
                                        if (!packsource.onlypack) {
                                            packsource.classList.remove('thundertext');
                                            if (!get.is.phoneLayout() || !lib.config.filternode_button) {
                                                packsource.innerHTML = '武将包';
                                            }
                                        }
                                    }
                                    if (this.classList.contains('thundertext')) {
                                        dialog.currentcapt2 = null;
                                        dialog.currentcaptnode2 = null;
                                        this.classList.remove('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.remove('active');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentcaptnode2) {
                                            dialog.currentcaptnode2.classList.remove('thundertext');
                                            if (dialog.currentcaptnode2.touchlink) {
                                                dialog.currentcaptnode2.touchlink.classList.remove('active');
                                            }
                                        }
                                        dialog.currentcapt2 = this.link;
                                        dialog.currentcaptnode2 = this;
                                        this.classList.add('thundertext');
                                        if (this.touchlink) {
                                            this.touchlink.classList.add('active');
                                        } else if (this.parentNode == newlined2) {
                                            packsource.innerHTML = this.innerHTML;
                                            packsource.classList.add('thundertext');
                                        }
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                if (dialog.buttons[i].activate) {
                                                    dialog.buttons[i].activate();
                                                }
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    }
                                }
                                if (dialog.seperate) {
                                    for (var i = 0; i < dialog.seperate.length; i++) {
                                        if (!dialog.seperate[i].nextSibling.querySelector('.button:not(.nodisplay)')) {
                                            dialog.seperate[i].style.display = 'none';
                                            dialog.seperate[i].nextSibling.style.display = 'none';
                                        } else {
                                            dialog.seperate[i].style.display = '';
                                            dialog.seperate[i].nextSibling.style.display = '';
                                        }
                                    }
                                }
                                if (filternode) {
                                    if (filternode.querySelector('.active')) {
                                        packsource.classList.add('thundertext');
                                    } else {
                                        packsource.classList.remove('thundertext');
                                    }
                                }
                                if (e) e.stopPropagation();
                            };
                            for (var i = 0; i < namecapt.length; i++) {
                                if (namecapt[i] == 'newline') {
                                    newlined = document.createElement('div');
                                    newlined.style.marginTop = '5px';
                                    newlined.style.display = 'block';
                                    if (get.is.phoneLayout()) {
                                        newlined.style.fontSize = '32px';
                                    } else {
                                        newlined.style.fontSize = '22px';
                                    }
                                    newlined.style.textAlign = 'center';
                                    node.appendChild(newlined);
                                } else if (newlined) {
                                    var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius');
                                    span.style.margin = '3px';
                                    span.style.width = 'auto';
                                    span.innerHTML = ` ${namecapt[i].toUpperCase()} `;
                                    span.link = namecapt[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    newlined.appendChild(span);
                                    node[namecapt[i]] = span;
                                    if (namecapt[i] == '收藏') {
                                        span._nature = 'fire';
                                    } else {
                                        span._nature = 'wood';
                                    }
                                } else {
                                    var span = document.createElement('span');
                                    span.innerHTML = ` ${namecapt[i].toUpperCase()} `;
                                    span.link = namecapt[i];
                                    span.alphabet = true;
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    node.appendChild(span);
                                }
                            }
                            if (!thisiscard) {
                                var natures = ['water', 'soil', 'wood', 'metal'];
                                var span = document.createElement('span');
                                newlined.appendChild(span);
                                span.style.margin = '8px';
                                var clickGroup = function () {
                                    if (_status.dragged) return;
                                    if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                                        dialog.currentcapt2 = null;
                                        dialog.currentcaptnode2.classList.remove('thundertext');
                                        dialog.currentcaptnode2.inited = true;
                                        dialog.currentcaptnode2 = null;
                                    }
                                    var node = this,
                                        link = this.link;
                                    if (node.classList.contains('thundertext')) {
                                        dialog.currentgroup = null;
                                        dialog.currentgroupnode = null;
                                        node.classList.remove('thundertext');
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                dialog.buttons[i].classList.remove('nodisplay');
                                            }
                                        }
                                    } else {
                                        if (dialog.currentgroupnode) {
                                            dialog.currentgroupnode.classList.remove('thundertext');
                                        }
                                        dialog.currentgroup = link;
                                        dialog.currentgroupnode = node;
                                        node.classList.add('thundertext');
                                        for (var i = 0; i < dialog.buttons.length; i++) {
                                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                                dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup == 'double') {
                                                if (dialog.buttons[i]._changeGroup) dialog.buttons[i].classList.remove('nodisplay');
                                                else dialog.buttons[i].classList.add('nodisplay');
                                            } else if (dialog.currentgroup == 'ye') {
                                                if (dialog.buttons[i].group == 'ye') dialog.buttons[i].classList.remove('nodisplay');
                                                else dialog.buttons[i].classList.add('nodisplay');
                                            } else {
                                                if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group != dialog.currentgroup) {
                                                    dialog.buttons[i].classList.add('nodisplay');
                                                } else {
                                                    dialog.buttons[i].classList.remove('nodisplay');
                                                }
                                            }
                                        }
                                    }
                                };
                                for (var i = 0; i < groups.length; i++) {
                                    var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                                    span.style.margin = '3px';
                                    newlined.appendChild(span);
                                    span.innerHTML = get.translation(groups[i]);
                                    span.link = groups[i];
                                    span._nature = natures[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickGroup);
                                }
                                var span = document.createElement('span');
                                newlined.appendChild(span);
                                span.style.margin = '8px';
                                packsource = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                                packsource.style.margin = '3px';
                                newlined.appendChild(packsource);
                                var filternode = null;
                                var clickCaptNode = function (e) {
                                    delete _status.filterCharacter;
                                    ui.window.classList.remove('shortcutpaused');
                                    filternode.delete();
                                    filternode.classList.remove('shown');
                                    clickCapt.call(this.link, e);
                                };
                                if (get.is.phoneLayout() && lib.config.filternode_button) {
                                    newlined.style.marginTop = '';
                                    packsource.innerHTML = '筛选';
                                    filternode = ui.create.div('.popup-container.filter-character.modenopause');
                                    ui.create.div(filternode);
                                    filternode.listen(function (e) {
                                        if (this.classList.contains('removing')) return;
                                        delete _status.filterCharacter;
                                        ui.window.classList.remove('shortcutpaused');
                                        this.delete();
                                        this.classList.remove('shown');
                                        e.stopPropagation();
                                    });
                                    for (var i = 0; i < node.childElementCount; i++) {
                                        if (node.childNodes[i].tagName.toLowerCase() == 'span') {
                                            node.childNodes[i].style.display = 'none';
                                            node.childNodes[i].touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large.capt', node.childNodes[i].innerHTML);
                                            node.childNodes[i].touchlink.link = node.childNodes[i];
                                        }
                                    }
                                    ui.create.node('br', filternode.firstChild);
                                } else {
                                    if (onlypack) {
                                        packsource.onlypack = true;
                                        packsource.innerHTML = get.translation(onlypack + '_character_config');
                                        packsource.style.display = 'none';
                                        packsource.previousSibling.style.display = 'none';
                                    } else {
                                        packsource.innerHTML = '武将包';
                                    }
                                }
                                newlined2 = document.createElement('div');
                                newlined2.style.marginTop = '5px';
                                newlined2.style.display = 'none';
                                newlined2.style.fontFamily = 'xinwei';
                                newlined2.classList.add('pointernode');
                                if (get.is.phoneLayout()) {
                                    newlined2.style.fontSize = '32px';
                                } else {
                                    newlined2.style.fontSize = '22px';
                                }
                                newlined2.style.textAlign = 'center';
                                node.appendChild(newlined2);
                                packsource.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                    if (packsource.onlypack) return;
                                    if (_status.dragged) return;
                                    if (get.is.phoneLayout() && lib.config.filternode_button && filternode) {
                                        _status.filterCharacter = true;
                                        ui.window.classList.add('shortcutpaused');
                                        ui.window.appendChild(filternode);
                                        ui.refresh(filternode);
                                        filternode.classList.add('shown');
                                        var dh = filternode.offsetHeight - filternode.firstChild.offsetHeight;
                                        if (dh > 0) {
                                            filternode.firstChild.style.top = dh / 2 + 'px';
                                        } else {
                                            filternode.firstChild.style.top = '';
                                        }
                                    } else {
                                        if (newlined2.style.display == 'none') {
                                            newlined2.style.display = 'block';
                                        } else {
                                            newlined2.style.display = 'none';
                                        }
                                    }
                                });
                                var packlist = [];
                                for (var i = 0; i < lib.config.all.characters.length; i++) {
                                    if (!lib.config.characters.includes(lib.config.all.characters[i])) continue;
                                    packlist.push(lib.config.all.characters[i]);
                                }
                                for (var i in lib.characterPack) {
                                    if (lib.config.characters.includes(i) && !lib.config.all.characters.includes(i)) {
                                        packlist.push(i);
                                    }
                                }
                                for (var i = 0; i < packlist.length; i++) {
                                    var span = document.createElement('div');
                                    span.style.display = 'inline-block';
                                    span.style.width = 'auto';
                                    span.style.margin = '5px';
                                    if (get.is.phoneLayout()) {
                                        span.style.fontSize = '32px';
                                    } else {
                                        span.style.fontSize = '22px';
                                    }
                                    span.innerHTML = lib.translate[packlist[i] + '_character_config'];
                                    span.link = packlist[i];
                                    span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                    newlined2.appendChild(span);
                                    if (filternode && !onlypack) {
                                        span.touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large', span.innerHTML);
                                        span.touchlink.link = span;
                                    }
                                }
                            }
                            var groupSort;
                            if (thisiscard) {
                                groupSort = function (name) {
                                    var type = lib.card[name[2]].type;
                                    if (lib.cardType[type]) {
                                        return lib.cardType[type];
                                    }
                                    switch (type) {
                                        case 'basic':
                                            return 0;
                                        case 'chess':
                                            return 1.5;
                                        case 'trick':
                                            return 2;
                                        case 'delay':
                                            return 3;
                                        case 'equip':
                                            return 4;
                                        case 'zhenfa':
                                            return 5;
                                        default:
                                            return 6;
                                    }
                                };
                                list.sort(function (a, b) {
                                    var del = groupSort(a) - groupSort(b);
                                    if (del != 0) return del;
                                    var aa = a,
                                        bb = b;
                                    if (a.includes('_')) {
                                        a = a.slice(a.lastIndexOf('_') + 1);
                                    }
                                    if (b.includes('_')) {
                                        b = b.slice(b.lastIndexOf('_') + 1);
                                    }
                                    if (a != b) {
                                        return a > b ? 1 : -1;
                                    }
                                    return aa > bb ? 1 : -1;
                                });
                            } else {
                                list.sort(lib.sort.character);
                            }
                            dialog = ui.create.dialog('hidden');
                            dialog.classList.add('noupdate');
                            dialog.classList.add('scroll1');
                            dialog.classList.add('scroll2');
                            dialog.classList.add('scroll3');
                            dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                                _status.clicked2 = true;
                            });
                            if (heightset) {
                                dialog.style.height = (game.layout == 'long2' || game.layout == 'nova' ? 380 : 350) + 'px';
                                dialog._scrollset = true;
                            }
                            dialog.getCurrentCapt = function (link, capt, noalph) {
                                var currentcapt = noalph ? this.currentcapt2 : this.currentcapt;
                                if (this.seperatelist && noalph) {
                                    if (this.seperatelist[currentcapt].includes(link)) return capt;
                                    return null;
                                }
                                if (lib.characterDialogGroup[currentcapt]) {
                                    return lib.characterDialogGroup[currentcapt](link, capt);
                                }
                                if (lib.characterPack[currentcapt]) {
                                    if (lib.characterPack[currentcapt][link]) {
                                        return capt;
                                    }
                                    return null;
                                }
                                return this.currentcapt;
                            };
                            if (str) {
                                dialog.add(str);
                            }
                            dialog.add(node);
                            if (thisiscard) {
                                if (seperate) {
                                    seperate = seperate(list);
                                    dialog.seperate = [];
                                    dialog.seperatelist = seperate.list;
                                    if (dialog.seperatelist) {
                                        newlined = document.createElement('div');
                                        newlined.style.marginTop = '5px';
                                        newlined.style.display = 'block';
                                        newlined.style.fontFamily = 'xinwei';
                                        if (get.is.phoneLayout()) {
                                            newlined.style.fontSize = '32px';
                                        } else {
                                            newlined.style.fontSize = '22px';
                                        }
                                        newlined.style.textAlign = 'center';
                                        node.appendChild(newlined);
                                        for (var i in dialog.seperatelist) {
                                            var span = document.createElement('span');
                                            span.style.margin = '3px';
                                            span.innerHTML = i;
                                            span.link = i;
                                            span.seperate = true;
                                            span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                            newlined.appendChild(span);
                                        }
                                    }
                                    for (var i in seperate) {
                                        if (i == 'list') continue;
                                        var link = '';
                                        var linkcontent = seperate[i];
                                        if (i.includes('_link:')) {
                                            link = i.slice(i.indexOf('_link:') + 6);
                                            i = i.slice(0, i.indexOf('_link:'));
                                        }
                                        var nodesep = dialog.add(i);
                                        nodesep.link = link;
                                        dialog.seperate.push(nodesep);
                                        dialog.add([linkcontent, 'vcard'], noclick);
                                    }
                                } else {
                                    dialog.add([list, 'vcard'], noclick);
                                }
                            } else {
                                if (precharacter) {
                                    dialog.add([list, 'precharacter'], noclick);
                                } else if (characterx) {
                                    dialog.add([list, 'characterx'], noclick);
                                } else {
                                    dialog.add([list, 'character'], noclick);
                                }
                            }
                            dialog.add(ui.create.div('.placeholder'));
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (thisiscard) {
                                    dialog.buttons[i].capt = getCapt(dialog.buttons[i].link[2]);
                                } else {
                                    dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
                                    dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
                                }
                            }
                            if (!expandall) {
                                if (!thisiscard && (lib.characterDialogGroup[lib.config.character_dialog_tool] || lib.config.character_dialog_tool == '自创')) {
                                    clickCapt.call(node[lib.config.character_dialog_tool]);
                                }
                            }
                            //仅仅下面是新加的,by Curpond
                            let container = dialog.querySelector('.content-container>.content');
                            let Searcher = ui.create.div('.searcher.caption');
                            let input = document.createElement('input');
                            input.style.textAlign = 'center';
                            input.style.border = 'solid 2px #294510';
                            input.style.borderRadius = '6px';
                            input.style.fontWeight = 'bold';
                            input.style.fontSize = '21px';
                            let find = ui.create.button(['find', '搜索'], 'tdnodes');
                            find.style.display = 'inline';
                            let clickfind = function (e) {
                                e.stopPropagation();
                                let value = input.value;
                                if (value == '') {
                                    game.alert('搜索不能为空');
                                    input.focus();
                                    return;
                                }
                                let list = [];
                                for (let btn of dialog.buttons) {
                                    if (new RegExp(value, 'g').test(get.translation(btn.link))) {
                                        btn.classList.remove('nodisplay');
                                    } else {
                                        btn.classList.add('nodisplay');
                                    }
                                }
                            };
                            input.addEventListener('keyup', (e) => {
                                if (e.key == 'Enter') clickfind(e);
                            });
                            find.listen(clickfind);
                            Searcher.appendChild(input);
                            Searcher.appendChild(find);
                            container.prepend(Searcher);
                            return dialog;
                        };
                    },
                    set() { },
                }); //选将列表修改
            } //武将全部可选
        },
        precontent() {
            //—————————————————————————————————————————————————————————————————————————————数据操作相关自定义函数
            const numfunc = function () {
                if (!lib.number) {
                    lib.number = [];
                    for (var i = 1; i < 14; i++) {
                        lib.number.add(i);
                    }
                } //添加lib.number
                window.sgn = function (bool) {
                    if (bool) return 1;
                    return -1;
                }; //true转为1,false转为-1
                window.numberq0 = function (num) {
                    if (isNaN(Number(num))) return 0;
                    return Math.abs(Number(num));
                }; //始终返回正数(取绝对值)
                window.numberq1 = function (num) {
                    if (isNaN(Number(num))) return 1;
                    return Math.max(Math.abs(Number(num)), 1);
                }; //始终返回正数且至少为1(取绝对值)
                window.number0 = function (num) {
                    if (isNaN(Number(num))) return 0;
                    return Math.max(Number(num), 0);
                }; //始终返回正数
                window.number1 = function (num) {
                    if (isNaN(Number(num))) return 1;
                    return Math.max(Number(num), 1);
                }; //始终返回正数且至少为1
                window.deepClone = function (obj) {
                    const clone = {};
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const info = obj[key];
                            if (typeof info == 'object') {
                                if (Array.isArray(info)) {
                                    clone[key] = info.slice();
                                } else {
                                    clone[key] = window.deepClone(info);
                                }
                            } else {
                                clone[key] = info;
                            }
                        }
                    }
                    return clone;
                }; //深拷贝对象
                window.factorial = function (num) {
                    num = Math.round(num);
                    if (num < 0) {
                        return 0;
                    }
                    if (num < 2) {
                        return 1;
                    }
                    let result = 1;
                    for (let i = 2; i <= num; i++) {
                        result *= i;
                    }
                    return result;
                }; //阶乘
                window.isPrime = function (num) {
                    if (num === 2 || num === 3) return true;
                    if (num < 2 || num % 2 === 0 || num % 3 === 0) return false;
                    for (let i = 5; i * i <= num; i += 6) {
                        if (num % i === 0 || num % (i + 2) === 0) return false;
                    }
                    return true;
                }; // 质数
            };
            numfunc();
            //—————————————————————————————————————————————————————————————————————————————播放视频与背景图片相关函数
            const video = function () {
                HTMLDivElement.prototype.setBackgroundImage = function (src) {
                    if (Array.isArray(src)) {
                        src = src[0];
                    }
                    if (src.includes('.mp4')) {
                        this.style.backgroundImage = 'none';
                        this.setBackgroundMp4(src);
                    } else {
                        this.style.backgroundImage = `url(${src})`;
                    }
                    return this;
                }; //引入mp4新逻辑
                HTMLElement.prototype.setBackgroundMp4 = function (src) {
                    const video = document.createElement('video');
                    video.src = src;
                    video.style.cssText = 'bottom: 0%; left: 0%; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; position: absolute; z-index: -5;';
                    video.autoplay = true;
                    video.loop = true;
                    this.appendChild(video);
                    video.addEventListener('error', function () {
                        video.remove();
                    });
                    return video;
                }; //给父元素添加一个覆盖的背景mp4
                game.charactersrc = function (name) {
                    const info = lib.character[name];
                    if (info && info.trashBin) {
                        for (const value of info.trashBin) {
                            if (value.startsWith('img:')) {
                                return value.slice(4);
                            }
                            if (value.startsWith('ext:')) {
                                return value.replace(/^ext:/, 'extension/');
                            }
                            if (value.startsWith('character:')) {
                                name = value.slice(10);
                                break;
                            }
                        }
                    }
                    return `image/character/${name}.jpg`;
                }; //获取武将名对应立绘路径
                game.cardsrc = function (name) {
                    const info = lib.card[name];
                    if (info) {
                        if (info.image) {
                            if (info.image.startsWith('ext:')) {
                                return info.image.replace(/^ext:/, 'extension/');
                            }
                            return info.image;
                        }
                        const ext = info.fullskin ? 'png' : 'jpg';
                        if (info.modeimage) {
                            return `image/mode/${info.modeimage}/card/${name}.${ext}`;
                        }
                        if (info.cardimage) {
                            name = info.cardimage;
                        }
                        return `image/card/${name}.${ext}`;
                    }
                }; //获取武将名对应立绘路径
                HTMLElement.prototype.HL_BG = function (name) {
                    const src = `extension/火灵月影/mp4/${name}.mp4`;
                    const video = this.setBackgroundMp4(src);
                    return video;
                }; //火灵月影背景mp4
                game.HL_mp4 = async function (name) {
                    return new Promise((resolve) => {
                        const video = document.createElement('video');
                        video.src = `extension/火灵月影/mp4/${name}.mp4`;
                        video.style.cssText = 'z-index: 999; height: 100%; width: 100%; position: fixed; object-fit: cover; left: 0; right: 0; mix-blend-mode: screen; pointer-events: none;';
                        video.autoplay = true;
                        video.loop = false;
                        const backButton = document.createElement('div');
                        backButton.innerHTML = '返回游戏'; //文字内容
                        backButton.style.cssText = 'z-index: 999; position: absolute; bottom: 10px; right: 10px; color: red; font-size: 16px; padding: 5px 10px; background: rgba(0, 0, 0, 0.3);';
                        backButton.onclick = function () {
                            backButton.remove();
                            video.remove();
                            resolve();
                        }; //设置返回按钮的点击事件
                        document.body.appendChild(video); //document上面创建video元素之后不要立刻贴上,加一个延迟可以略过前面的播放框,配置越烂延迟越大
                        document.body.appendChild(backButton);
                        video.addEventListener('error', function () {
                            backButton.remove();
                            video.remove();
                            resolve();
                        });
                        video.addEventListener('ended', function () {
                            backButton.remove();
                            video.remove();
                            resolve();
                        });
                    });
                }; //播放mp4
            };
            video();
            //—————————————————————————————————————————————————————————————————————————————解构魔改本体函数
            const mogai = function () {
                lib.element.player.dyingResult = async function () {
                    const player = this;
                    game.log(player, '濒死');
                    _status.dying.unshift(player);
                    for (const i of game.players) {
                        const { result } = await i.chooseToUse({
                            filterCard: (card, player, event) => lib.filter.cardSavable(card, player, _status.dying[0]),
                            filterTarget(card, player, target) {
                                if (target != _status.dying[0]) return false;
                                if (!card) return false;
                                var info = get.info(card);
                                if (!info.singleCard || ui.selected.targets.length == 0) {
                                    var mod = game.checkMod(card, player, target, 'unchanged', 'playerEnabled', player);
                                    if (mod == false) return false;
                                    var mod = game.checkMod(card, player, target, 'unchanged', 'targetEnabled', target);
                                    if (mod != 'unchanged') return mod;
                                }
                                return true;
                            },
                            prompt: get.translation(_status.dying[0]) + '濒死,是否帮助？',
                            ai1: () => 1,
                            ai2() {
                                return get.attitude(_status.dying[0], i);
                            }, //QQQ
                            type: 'dying',
                            targetRequired: true,
                            dying: _status.dying[0],
                        });
                        if (result?.bool) {
                            _status.dying.remove(player);
                            break;
                        }
                    }
                    if (_status.dying.includes(player)) {
                        await player.die();
                    }
                    return player;
                }; //濒死结算
                lib.element.player.yinni = function () {
                    const player = this;
                    player.storage.rawHp = player.hp;
                    player.storage.rawMaxHp = player.maxHp;
                    if (player.skills.length) {
                        if (!player.hiddenSkills) {
                            player.hiddenSkills = [];
                        }
                        for (const i of player.skills.slice()) {
                            player.removeSkill(i);
                            player.hiddenSkills.add(i);
                        }
                    }
                    player.classList.add('unseen');
                    player.name = 'unknown';
                    player.sex = 'male';
                    player.storage.nohp = true;
                    player.node.hp.hide();
                    player.addSkill('g_hidden_ai');
                    player.hp = 1;
                    player.maxHp = 1;
                    player.update();
                    return player;
                }; //隐匿函数
                lib.element.player.qreinit = function (name) {
                    const player = this;
                    const info = lib.character[name];
                    player.name1 = name;
                    player.name = name;
                    player.sex = info.sex;
                    player.changeGroup(info.group, false);
                    for (const i of info.skills) {
                        player.addSkill(i);
                    }
                    player.maxHp = get.infoMaxHp(info.maxHp);
                    player.hp = player.maxHp;
                    game.addVideo('reinit3', player, {
                        name: name,
                        hp: player.maxHp,
                        avatar2: player.name2 == name,
                    });
                    player.smoothAvatar(false);
                    player.node.avatar.setBackground(name, 'character');
                    player.node.name.innerHTML = get.translation(name);
                    player.update();
                    return player;
                }; //变身
                lib.element.player.quseCard = async function (card, targets, cards) {
                    const player = this;
                    if (typeof card == 'string') {
                        card = { name: card };
                    }
                    const name = card.name;
                    const info = lib.card[name];
                    if (!cards) {
                        cards = [card];
                    }
                    const skill = _status.event.skill;
                    if (info.contentBefore) {
                        const next = game.createEvent(name + 'ContentBefore', false);
                        if (next.parent) {
                            next.parent.stocktargets = targets;
                        }
                        next.targets = targets;
                        next.card = card;
                        next.cards = cards;
                        next.player = player;
                        next.skill = skill;
                        next.type = 'precard';
                        next.forceDie = true;
                        await next.setContent(info.contentBefore);
                    }
                    if (!info.multitarget) {
                        for (const target of targets) {
                            if (target && target.isDead()) return;
                            if (info.notarget) return;
                            const next = game.createEvent(name, false);
                            if (next.parent) {
                                next.parent.directHit = [];
                            }
                            next.targets = targets;
                            next.target = target;
                            next.card = card;
                            if (info.type == 'delay') {
                                next.card = {
                                    name: name,
                                    cards: cards,
                                };
                            }
                            next.cards = cards;
                            next.player = player;
                            next.type = 'card';
                            next.skill = skill;
                            next.baseDamage = Math.max(numberq1(info.baseDamage));
                            next.forceDie = true;
                            next.directHit = true;
                            await next.setContent(info.content);
                        }
                    } else {
                        if (info.notarget) return;
                        const next = game.createEvent(name, false);
                        if (next.parent) {
                            next.parent.directHit = [];
                        }
                        next.targets = targets;
                        next.target = targets[0];
                        next.card = card;
                        if (info.type == 'delay') {
                            next.card = {
                                name: name,
                                cards: cards,
                            };
                        }
                        next.cards = cards;
                        next.player = player;
                        next.type = 'card';
                        next.skill = skill;
                        next.baseDamage = Math.max(numberq1(info.baseDamage));
                        next.forceDie = true;
                        next.directHit = true;
                        await next.setContent(info.content);
                    }
                    if (info.contentAfter) {
                        const next = game.createEvent(name + 'ContentAfter', false);
                        next.targets = targets;
                        next.card = card;
                        next.cards = cards;
                        next.player = player;
                        next.skill = skill;
                        next.type = 'postcard';
                        next.forceDie = true;
                        await next.setContent(info.contentAfter);
                    }
                    return player;
                }; //解构用牌
                lib.element.player.qrevive = function () {
                    const player = this;
                    if (player.parentNode != ui.arena) {
                        ui.arena.appendChild(player);
                    } //防止被移除节点
                    player.classList.remove('removing');
                    player.classList.remove('hidden');
                    player.classList.remove('dead');
                    game.log(player, '复活');
                    if (player.maxHp < 1) player.maxHp = 1;
                    player.hp = player.maxHp;
                    game.addVideo('revive', player);
                    player.removeAttribute('style');
                    player.node.avatar.style.transform = '';
                    player.node.avatar2.style.transform = '';
                    player.node.hp.show();
                    player.node.equips.show();
                    player.node.count.show();
                    player.update();
                    game.players.add(player);
                    game.dead.remove(player);
                    player.draw(Math.min(player.maxHp, 20));
                    return player;
                }; //复活函数
                lib.element.player.zhenshang = function (num, source, nature) {
                    const player = this;
                    let str = '受到了';
                    if (source) {
                        str += `来自<span class='bluetext'>${source == player ? '自己' : get.translation(source)}</span>的`;
                    }
                    str += get.cnNumber(num) + '点';
                    if (nature) {
                        str += get.translation(nature) + '属性';
                    }
                    str += '伤害';
                    game.log(player, str);
                    const stat = player.stat;
                    const statx = stat[stat.length - 1];
                    if (!statx.damaged) {
                        statx.damaged = num;
                    } else {
                        statx.damaged += num;
                    }
                    if (source) {
                        const stat = source.stat;
                        const statx = stat[stat.length - 1];
                        if (!statx.damage) {
                            statx.damage = num;
                        } else {
                            statx.damage += num;
                        }
                    }
                    player.hp -= num;
                    player.update();
                    player.$damage(source);
                    var natures = (nature || '').split(lib.natureSeparator);
                    game.broadcastAll(
                        function (natures, player) {
                            if (lib.config.animation && !lib.config.low_performance) {
                                if (natures.includes('fire')) {
                                    player.$fire();
                                }
                                if (natures.includes('thunder')) {
                                    player.$thunder();
                                }
                            }
                        },
                        natures,
                        player
                    );
                    var numx = player.hasSkillTag('nohujia') ? num : Math.max(0, num - player.hujia);
                    player.$damagepop(-numx, natures[0]);
                    if (player.hp <= 0 && player.isAlive()) {
                        player.dying({ source: source });
                    }
                    return player;
                }; //真实伤害
                lib.element.player.qequip = function (card) {
                    const player = this;
                    if (Array.isArray(card)) {
                        for (const i of card) {
                            player.qequip(i);
                        }
                    } else if (card) {
                        if (card[card.cardSymbol]) {
                            const owner = get.owner(card);
                            const vcard = card[card.cardSymbol];
                            if (owner) {
                                owner.vcardsMap?.equips.remove(vcard);
                            }
                            player.vcardsMap?.equips.add(vcard);
                        } else {
                            const vcard = new lib.element.VCard(card);
                            const cardSymbol = Symbol('card');
                            card.cardSymbol = cardSymbol;
                            card[cardSymbol] = vcard;
                            player.vcardsMap?.equips.push(vcard);
                        }
                        player.node.equips.appendChild(card);
                        card.style.transform = '';
                        card.node.name2.innerHTML = `${get.translation(card.suit)}${card.number} ${get.translation(card.name)}`;
                        const info = lib.card[card.name];
                        if (info && info.skills) {
                            for (const i of info.skills) {
                                player.addSkillTrigger(i);
                            }
                        }
                    }
                    return player;
                };
            }; //解构魔改本体函数
            mogai();
            //—————————————————————————————————————————————————————————————————————————————视为转化虚拟牌相关自创函数
            const shiwei = function () {
                lib.element.player.filterCardx = function (card, filter) {
                    if (typeof card == 'string') {
                        card = { name: card };
                    }
                    const player = this,
                        info = get.info(card);
                    if (!lib.filter.cardEnabled(card, player)) return false; //卡牌使用限制
                    if (info.notarget) return true;
                    if (!info.filterTarget) return true;
                    if (!info.enable) return true;
                    return game.hasPlayer(function (current) {
                        if (info.multicheck && !info.multicheck(card, player)) return false;
                        if (filter) {
                            if (!lib.filter.targetInRange(card, player, current)) return false; //距离限制
                            return lib.filter.targetEnabledx(card, player, current);
                        }
                        return lib.filter.targetEnabled(card, player, current); //目标限制
                    });
                }; //适用于choosetouse的filtercard
                lib.element.player.filterCard = function (card, filter) {
                    if (typeof card == 'string') {
                        card = { name: card };
                    }
                    const player = this,
                        info = get.info(card),
                        event = _status.event;
                    const evt = event.name.startsWith('chooseTo') ? event : event.getParent((q) => q.name.startsWith('chooseTo'));
                    if (evt.filterCard2) {
                        return evt._backup.filterCard(card, player, evt);
                    } //viewAs的技能会修改chooseToUse事件的filterCard
                    else if (evt.filterCard && evt.filterCard != lib.filter.filterCard) {
                        return evt.filterCard(card, player, evt); //这里也有次数限制
                    } else {
                        if (!lib.filter.cardEnabled(card, player)) return false; //卡牌使用限制
                        if (info.notarget) return true;
                        if (!info.filterTarget) return true;
                        if (!info.enable) return true;
                        if (evt.name == 'chooseToRespond') return true; //chooseToRespond无次数距离目标限制
                        if (filter) {
                            if (!lib.filter.cardUsable(card, player, evt)) return false; //次数限制
                        }
                        if (evt.filterTarget && evt.filterTarget != lib.filter.filterTarget) {
                            return game.hasPlayer(function (current) {
                                return evt.filterTarget(card, player, current);
                            });
                        }
                        return game.hasPlayer(function (current) {
                            if (info.multicheck && !info.multicheck(card, player)) return false;
                            if (filter) {
                                if (!lib.filter.targetInRange(card, player, current)) return false; //距离限制
                                return lib.filter.targetEnabledx(card, player, current);
                            }
                            return lib.filter.targetEnabled(card, player, current); //目标限制
                        });
                    }
                }; //删除次数限制//filter决定有无次数距离限制//viewAs的技能会修改chooseToUse事件的filterCard
                lib.element.player.qcard = function (type, filter, range) {
                    const list = [];
                    for (const i in lib.card) {
                        const info = lib.card[i];
                        if (info.mode && !info.mode.includes(lib.config.mode)) {
                            continue;
                        }
                        if (!info.content) {
                            continue;
                        }
                        if (['delay', 'equip'].includes(info.type)) {
                            continue;
                        }
                        if (type && info.type != type) {
                            continue;
                        }
                        if (filter !== false) {
                            const player = this;
                            if (range !== false) {
                                range = true;
                            }
                            if (!player.filterCard(i, range)) {
                                continue;
                            }
                        }
                        list.push([lib.suits.randomGet(), lib.number.randomGet(), i]); //花色/点数/牌名/属性/应变
                        if (i == 'sha') {
                            for (const j of Array.from(lib.nature.keys())) {
                                list.push([lib.suits.randomGet(), lib.number.randomGet(), 'sha', j]);
                            }
                        }
                    }
                    return list;
                }; //可以转化为的牌//filter控制player.filterCard//range控制是否计算次数与距离限制
            };
            shiwei();
            //—————————————————————————————————————————————————————————————————————————————技能相关自创函数
            const jineng = function () {
                lib.element.player.GS = function () {
                    const player = this;
                    const skills = player.skills.slice();
                    for (const i of Array.from(player.node.equips.childNodes)) {
                        if (Array.isArray(lib.card[i.name].skills)) {
                            skills.addArray(lib.card[i.name].skills);
                        }
                    }
                    for (const i in player.additionalSkills) {
                        if (Array.isArray(player.additionalSkills[i])) {
                            skills.addArray(player.additionalSkills[i]);
                        } else if (typeof player.additionalSkills[i] == 'string') {
                            skills.add(player.additionalSkills[i]);
                        }
                    }
                    skills.addArray(Object.keys(player.tempSkills));
                    skills.addArray(player.hiddenSkills);
                    skills.addArray(player.invisibleSkills);
                    return skills;
                }; //获取武将所有技能函数
                lib.element.player.GAS = function () {
                    const player = this;
                    const skills = player.skills.slice();
                    for (const i in player.additionalSkills) {
                        if (Array.isArray(player.additionalSkills[i])) {
                            skills.addArray(player.additionalSkills[i]);
                        } else if (typeof player.additionalSkills[i] == 'string') {
                            skills.add(player.additionalSkills[i]);
                        }
                    }
                    return skills;
                }; //获取武将的武将牌上技能函数
                lib.element.player.GES = function () {
                    const player = this;
                    const skills = [];
                    for (const i of Array.from(player.node.equips.childNodes)) {
                        if (Array.isArray(lib.card[i.name].skills)) {
                            skills.addArray(lib.card[i.name].skills);
                        }
                    }
                    return skills;
                }; //获取武将装备技能函数
                lib.element.player.GTS = function () {
                    const player = this;
                    return Object.keys(player.tempSkills);
                }; //获取武将临时技能函数
                lib.element.player.RS = function (skillx) {
                    const player = this;
                    if (Array.isArray(skillx)) {
                        for (const i of skillx) {
                            player.RS(i);
                        }
                    } else {
                        player.skills.remove(skillx);
                        player.hiddenSkills.remove(skillx);
                        player.invisibleSkills.remove(skillx);
                        delete player.tempSkills[skillx];
                        for (var i in player.additionalSkills) {
                            player.additionalSkills[i].remove(skillx);
                        }
                        player.checkConflict(skillx);
                        player.RST(skillx);
                        if (lib.skill.global.includes(skillx)) {
                            lib.skill.global.remove(skillx);
                            delete lib.skill.globalmap[skillx];
                            for (var i in lib.hook.globalskill) {
                                lib.hook.globalskill[i].remove(skillx);
                            }
                        }
                    }
                    return player;
                }; //移除技能函数
                lib.element.player.RST = function (skills) {
                    const player = this;
                    if (typeof skills == 'string') {
                        skills = [skills];
                    }
                    game.expandSkills(skills);
                    for (const skillx of skills) {
                        player.initedSkills.remove(skillx);
                        for (var i in lib.hook) {
                            if (Array.isArray(lib.hook[i]) && lib.hook[i].includes(skillx)) {
                                try {
                                    delete lib.hook[i];
                                } catch (e) {
                                    console.log(i + 'lib.hook不能delete');
                                }
                            }
                        }
                        for (var i in lib.hook.globalskill) {
                            if (lib.hook.globalskill[i].includes(skillx)) {
                                lib.hook.globalskill[i].remove(skillx);
                                if (lib.hook.globalskill[i].length == 0) {
                                    delete lib.hook.globalskill[i];
                                }
                            }
                        }
                    }
                    return player;
                }; //移除技能时机函数
                lib.element.player.CS = function () {
                    const player = this;
                    const skill = player.GS();
                    game.expandSkills(skill);
                    player.skills = [];
                    player.tempSkills = {};
                    player.initedSkills = [];
                    player.invisibleSkills = [];
                    player.hiddenSkills = [];
                    player.additionalSkills = {};
                    for (const key in lib.hook) {
                        if (key.startsWith(player.playerid)) {
                            try {
                                delete lib.hook[key];
                            } catch (e) {
                                console.log(key + 'lib.hook不能delete');
                            }
                        }
                    }
                    for (const hook in lib.hook.globalskill) {
                        for (const i of skill) {
                            if (lib.hook.globalskill[hook].includes(i)) {
                                lib.hook.globalskill[hook].remove(i);
                            }
                        }
                    }
                    return player;
                }; //清空所有技能函数
                lib.element.player.DS = function () {
                    const player = this;
                    const skill = player.GS();
                    game.expandSkills(skill);
                    player._hookTrigger = ['QQQ_fengjin'];
                    player.storage.skill_blocker = ['QQQ_fengjin'];
                    for (const i of skill) {
                        player.disabledSkills[i] = 'QQQ';
                        player.storage[`temp_ban_${i}`] = true;
                    }
                    return player;
                }; //失效所有技能函数
                lib.skill.QQQ_fengjin = {
                    hookTrigger: {
                        block: (event, player, triggername, skill) => true,
                    },
                    skillBlocker(skill, player) {
                        const info = lib.skill[skill];
                        return info && !info.kangxing;
                    },
                };
            }; //技能相关自创函数
            jineng();
            lib.element.player.xiedu = function (yinji) {
                const player = this;
                player.xiedujilu = true;
                if (!player.storage[yinji]) {
                    player.storage[yinji] = 0;
                }
                player.storage[yinji] += 2;
                player.addSkill(yinji);
            };
            lib.element.player.yanli = async function () {
                const player = this;
                player.storage.HL_wufan_1 = 0;
                const {
                    result: { links },
                } = await player.chooseButton(['严厉:弃置自己区域内任意张牌', player.getCards('hej')], [1, player.countCards('hej')]).set('ai', (b) => {
                    if (get.position(b.link) == 'e') return -1;
                    if (player.isPhaseUsing()) {
                        if (player.hasValueTarget(b.link, null, true)) return -1;
                        return 20 - get.value(b.link);
                    }
                    return 6 - get.useful(b.link);
                });
                if (links && links[0]) {
                    await player.discard(links);
                }
                game.playAudio(`../extension/火灵月影/audio/qinli_yanli${[1, 2, 3].randomGet()}.mp3`);
                if (game.players.some((q) => q != player && q.countCards('h'))) {
                    const {
                        result: { targets },
                    } = await player
                        .chooseTarget('严厉:观看一名其他角色的手牌,获得其一张牌')
                        .set('filterTarget', (c, p, t) => p != t && t.countCards('h'))
                        .set('ai', (t) => -get.attitude(player, t));
                    if (targets && targets[0]) {
                        player.gainPlayerCard(targets[0], 'hej', 'visible').set('ai', (b) => get.value(b.link));
                    }
                }
            }; //async内部不await,会卡掉前面的事件//async外部不await,会让后续事件卡到后面执行
            lib.element.player.canku = async function () {
                const player = this;
                player.storage.HL_wufan_2 = 0;
                const {
                    result: { targets },
                } = await player
                    .chooseTarget('残酷:移除一名其他角色的全部技能,直到你的回合结束')
                    .set('filterTarget', (c, p, t) => {
                        if (t.storage.HL_wufan?.length) {
                            return false;
                        }
                        return p != t;
                    })
                    .set('ai', (t) => -get.attitude(player, t));
                if (targets && targets[0]) {
                    if (!targets[0].storage.HL_wufan) {
                        targets[0].storage.HL_wufan = [];
                    }
                    targets[0].storage.HL_wufan.addArray(targets[0].GS());
                    targets[0].CS();
                    game.playAudio(`../extension/火灵月影/audio/qinli_canku${[1, 2, 3].randomGet()}.mp3`);
                }
            };
            lib.init.css('extension/火灵月影/HL.css'); //火灵月影专属CSS
            lib.init.css('extension/火灵月影/QQQ.css'); //通用CSS
            game.import('character', function (lib, game, ui, get, ai, _status) {
                const QQQ = {
                    name: '火灵月影',
                    connect: true,
                    character: {
                        //——————————————————————————————————————————————————————————————————————————————————————————————————BOSS
                        HL_amiya: {
                            sex: 'female',
                            hp: 1000,
                            maxHp: 1000,
                            skills: ['HL_buyingcunzai', 'HL_chuangyi', 'HL_jintouchongxian', 'HL_cunxuxianzhao', 'HL_wuzhong'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_ws_boss: {
                            sex: 'male',
                            hp: 100,
                            maxHp: 100,
                            skills: ['HL_ws_bossjieshao'],
                            isBoss: true,
                            isBossAllowed: true,
                            trashBin: [`ext:火灵月影/mp4/HL_ws_boss.mp4`],
                        },
                        HL_wangzuo: {
                            sex: 'female',
                            hp: 500,
                            maxHp: 500,
                            skills: ['HL_shengzhe', 'HL_wangdao', 'HL_tongxin'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_zhigaolieyang: {
                            sex: 'male',
                            hp: 40,
                            maxHp: 40,
                            skills: ['HL_A_zhi', 'HL_A_luo', 'HL_A_ji', 'HL_A_heng', 'HL_A_nu', 'HL_A_zhuan'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_shao: {
                            hp: 8,
                            maxHp: 8,
                            skills: ['HL_kangkaijiang', 'HL_yelongliezhan', 'HL_pulaomingzhong', 'HL_gongfubishui', 'HL_shaoEGO', 'HL_xingxingzhihuo'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_libai_boss: {
                            sex: 'male',
                            skills: ['HL_libai_bossjieshao'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_canxin: {
                            sex: 'female',
                            skills: ['HL_liankui', 'HL_xuansi', 'HL_duoxing'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_jielv: {
                            sex: 'male',
                            hp: 7,
                            maxHp: 7,
                            skills: ['HL_tianqi', 'HL_wanshen', 'HL_jieming', 'HL_wanlv'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_huo: {
                            sex: 'male',
                            hp: 99,
                            maxHp: 100,
                            skills: ['HL_wangdaox', 'HL_buyun', 'HL_qifeng', 'HL_pojie'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————普通
                        HL_kuilei: {
                            sex: 'female',
                            skills: [],
                        },
                        HL_libai1: {
                            sex: 'male',
                            skills: ['HL_baiyujing', 'HL_manhuying', 'HL_shibusha', 'HL_wurenzhi'],
                            hp: 3,
                            maxHp: 3,
                        },
                        HL_libai2: {
                            sex: 'male',
                            skills: ['HL_baiyujing', 'HL_manhuying', 'HL_shibusha', 'HL_xujinhuan', 'HL_kongduiyue'],
                            hp: 6,
                            maxHp: 6,
                        },
                        HL_libai3: {
                            sex: 'male',
                            skills: ['HL_baiyujing', 'HL_manhuying', 'HL_shibusha', 'HL_xinglunan', 'HL_duoqilu', 'HL_changfengpolang'],
                            hp: 9,
                            maxHp: 9,
                        },
                        HL_libai4: {
                            sex: 'male',
                            skills: ['HL_baiyujing', 'HL_manhuying', 'HL_shibusha', 'HL_yirihuan', 'HL_wanguchou', 'HL_penghaoren', 'HL_kaixinyan'],
                            hp: 12,
                            maxHp: 12,
                        },
                        HL_许劭: {
                            sex: 'male',
                            skills: ['HL_pingjian'],
                            trashBin: [`ext:火灵月影/mp4/HL_许劭.mp4`],
                        },
                        HL_李白: {
                            sex: 'male',
                            skills: ['醉诗'],
                        },
                        HL_shengwei: {
                            sex: 'male',
                            hp: 30,
                            maxHp: 30,
                            skills: ['HL_zhaohu', 'HL_quanyu'],
                        },
                        HL_kuilong: {
                            sex: 'male',
                            hp: 30,
                            maxHp: 30,
                            skills: ['HL_chengjie'],
                        },
                        HL_heiguanzunzhu: {
                            sex: 'male',
                            hp: 30,
                            maxHp: 30,
                            skills: ['HL_zhengfu'],
                        },
                        HL_manfuleide: {
                            sex: 'male',
                            hp: 30,
                            maxHp: 30,
                            skills: ['HL_junshixunlian'],
                        },
                        HL_kangxing: {
                            sex: 'male',
                            skills: ['HL_miaosha'],
                        },
                        HL_liru: {
                            sex: 'male',
                            hp: 60,
                            maxHp: 60,
                            skills: ['HL_fencheng', 'HL_juece', 'HL_mieji', 'HL_zhendi', 'HL_dujiu'],
                        },
                        HL_jiaxu: {
                            sex: 'male',
                            hp: 60,
                            maxHp: 60,
                            skills: ['HL_luanwu', 'HL_wansha', 'HL_weimu', 'HL_chengxiong', 'HL_duji'],
                        },
                        HL_huaxiong: {
                            sex: 'male',
                            hp: 120,
                            maxHp: 120,
                            skills: ['HL_yaowu', 'HL_shiyong', 'HL_shizhan', 'HL_yangwei', 'HL_zhenguan'],
                        },
                        HL_lvbu: {
                            sex: 'male',
                            hp: 80,
                            maxHp: 80,
                            skills: ['HL_wushuang', 'HL_wumou', 'HL_jiwu', 'HL_liyu', 'HL_shenwei'],
                        },
                        HL_yuwei: {
                            sex: 'male',
                            hp: 30,
                            maxHp: 30,
                            skills: ['HL_fushi', 'HL_zhene', 'HL_mengguang'],
                        },
                        HL_xiaoyong1: {
                            sex: 'male',
                            hp: 6,
                            maxHp: 6,
                            skills: ['HL_jindao'],
                        },
                        HL_xiaoyong2: {
                            sex: 'male',
                            hp: 6,
                            maxHp: 6,
                            skills: ['HL_jinqiang'],
                        },
                        HL_xiaoyong3: {
                            sex: 'male',
                            hp: 6,
                            maxHp: 6,
                            skills: ['HL_jingong'],
                        },
                        HL_zhengchen: {
                            sex: 'male',
                            hp: 24,
                            maxHp: 24,
                            skills: ['HL_zhenggu', 'HL_qieyan', 'HL_quan'],
                        },
                        HL_zhishi: {
                            sex: 'male',
                            hp: 4,
                            maxHp: 4,
                            skills: ['HL_tuxing'],
                        },
                        HL_zhushi: {
                            sex: 'male',
                            hp: 200,
                            maxHp: 200,
                            skills: ['HL_zhenguo'],
                        },
                        HL_fanren: {
                            sex: 'male',
                            hp: 3,
                            maxHp: 3,
                            skills: ['HL_fanyuan'],
                        },
                        HL_fengletinghou: {
                            sex: 'male',
                            hp: 120,
                            maxHp: 120,
                            skills: ['HL_pozhu', 'HL_jingxie', 'HL_qianxun', 'HL_dingli'],
                        },
                        HL_zhinukuanglei: {
                            sex: 'male',
                            hp: 40,
                            maxHp: 40,
                            skills: ['HL_A_zhi', 'HL_A_luo', 'HL_A_ming', 'HL_A_ting', 'HL_A_fen', 'HL_A_ce'],
                        },
                        HL_juemiezhe: {
                            sex: 'male',
                            hp: 40,
                            maxHp: 40,
                            skills: ['HL_A_zhi', 'HL_A_luo', 'HL_zhianchaoxi', 'HL_zhangbujimoyan', 'HL_jinhuisiji'],
                        },
                        HL_qinli: {
                            sex: 'female',
                            hp: 5,
                            maxHp: 5,
                            skills: ['HL_zhuolan', 'HL_jiaozhan', 'HL_wufan', 'HL_ziyu', 'HL_kuangbao'],
                            trashBin: [`ext:火灵月影/image/HL_qinli.png`],
                            dieAudios: ['ext:火灵月影/audio:3'],
                        },
                    },
                    characterIntro: {
                        HL_amiya: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)<br>存在于每个故事尽头,带走每位角色,封闭每种可能,停止每段讲述.它是对终结的想象,亦是所有想象的终结,它是一切,唯独不是你熟悉的人',
                        HL_shengwei: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)',
                        HL_kuilong: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)',
                        HL_heiguanzunzhu: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)',
                        HL_manfuleide: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)',
                        HL_李白: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)<br>在登临至高的路上,与我相伴的,只有一柄剑,一壶酒.我既是酒神,也是剑仙',
                        HL_liru: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_jiaxu: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_huaxiong: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_lvbu: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_wangzuo: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_fengletinghou: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_yuwei: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_xiaoyong1: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_xiaoyong2: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_xiaoyong3: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_zhengchen: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_zhishi: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_zhushi: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_fanren: '设计者:秋(1138146139)<br>编写者:潜在水里的火(1476811518)',
                        HL_zhigaolieyang: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)<br>天空之泰坦,不再宰制翁法罗斯的昼夜,却仍不改孤绝高傲的本性<br>在它眼中,破碎世界的凡俗是如此丑陋—————比起由光明守护的世界,浑浑噩噩的庸人反而与黑潮更加相配',
                        HL_zhinukuanglei: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)<br>天空之泰坦,不再宰制翁法罗斯的昼夜,却仍不改孤绝高傲的本性<br>在它眼中,破碎世界的凡俗是如此丑陋—————比起由光明守护的世界,浑浑噩噩的庸人反而与黑潮更加相配',
                        HL_juemiezhe: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)<br>以霸道统治天空的征服者,被黑潮裹挟后的样貌.往昔的是非功过或许难以评说,但此刻饱含杀意的,只是一团破坏一切的无明业火',
                        HL_shao: '设计者:雪月风花(3360488304)<br>编写者:潜在水里的火(1476811518)',
                        HL_jielv: '设计者:玲(2283058282)<br>编写者:潜在水里的火(1476811518)<br>传说,在诸纪湮灭之前,太初晦暗未明之时,一场棋局贯穿光阴与维度<br>星辰为棋,万族为赌,执棋者,是不曾具名的存在<br>他们于星海间落下第一子,自此,文明星火与命运经纬,皆循其不可名状之轨迹流转<br>而在那最古老的梦中,一缕神识悄然垂降,凭<记忆>重塑残损之躯<br>此身游走于虚实之隙,与无形宇宙博弈,只待某一刻将虚妄与真实分辨<br>在那无尽博弈中,许多记忆浮现,又被磨损<br>焦土之上,硝烟未散的废墟中,一道孤影漫无目的地穿行<br>也曾有雏菊盛开的原野,三道身影并肩伫立<br>一人目光执着,追寻真理的尽头;<br>一人自彼岸而来,温柔坚定,怀抱理想与超弦科技;<br>一人沉默不语,终将独自前行<br>天地静默,风掠旷野,一切宛若日落前的余温——短暂,却依稀可辨<br>彼时,创世七族尚未联手,世界沉浮于诸王之争<br>升维之火种在文明间明灭,诸界于低语中竞逐,生灵于倾塌中挣扎<br>最终,七王立下界碑,使众神之上亦有规矩,使纷争之中仍可得庇护<br>他们曾共筑一座理想之塔——又共同见证它倾塌<br>联盟瓦解,诸王渐隐<br>锁链穿过十二星环,将腐化的身躯沉入永寂<br>而这场博弈,从未终止<br>直至宇宙沉寂,直至梦中无声',
                        HL_qinli: `不知从哪里穿越而来的炎之精灵,涛涛烈焰焚天煮海,仙姿佚貌宛若天女,美丽与暴力于此刻共存`,
                    },
                    characterTitle: {
                        HL_李白: `<b style='color: #00FFFF; font-size: 25px;'>醉酒狂詩  青蓮劍仙</b>`,
                        HL_许劭: `<b style='color: #00FFFF; font-size: 25px;'>萬古英雄曾拔劍  鐵笛高吹龍夜吟</b>`,
                        HL_zhigaolieyang: `<b style='color:rgb(235, 20, 56); font-size: 25px;'>天空的化身</b>`,
                        HL_zhinukuanglei: `<b style='color: #00FFFF; font-size: 25px;'>天空的化身</b>`,
                        HL_juemiezhe: `<b style='color:rgb(47, 27, 224); font-size: 25px;'>阳雷的业果 晨昏之眼</b>`,
                        HL_jielv: `<b style='color:rgba(197, 209, 209, 1); font-size: 25px;'>太初弈无终</b>`,
                        HL_qinli: `<b style='color:rgba(230, 87, 21, 1); font-size: 25px;'>Efreet</b>`,
                    },
                    skill: {
                        //————————————————————————————————————————————扑克
                        // 对子
                        // 将两张同点数扑克对一名其他角色使用,目标须与使用者轮番打出两张更大的同点数扑克
                        // 直到某一方打出失败,此人受到1点伤害
                        pukepai_duizi: {
                            enable: 'phaseUse',
                            filterCard(c, p) {
                                if (ui.selected.cards.length) {
                                    return c.name == 'pukepai' && c.number == ui.selected.cards[0].number;
                                }
                                const cards = p.getCards('hs', { name: 'pukepai' });
                                const counts = {};
                                for (const card of cards) {
                                    counts[card.number] = (counts[card.number] || 0) + 1;
                                }
                                const duplicates = cards.filter((card) => counts[card.number] > 1);
                                return c.name == 'pukepai' && duplicates.includes(c);
                            },
                            selectCard: 2,
                            position: 'hs',
                            filterTarget(card, player, target) {
                                return target != player;
                            },
                            selectTarget: 1,
                            filter(event, player) {
                                const numbers = player.getCards('hs', { name: 'pukepai' }).map((card) => card.number);
                                return new Set(numbers).size < numbers.length;
                            }, //set的长度小于原数组,就说明有点数相同的牌
                            prompt: '将两张同点数扑克一起对一名其他角色使用,目标须与使用者轮番打出两张更大的同点数扑克<br>直到某一方打出失败,此人受到1点伤害',
                            async content(event, trigger, player) {
                                let num = event.cards[0].number;
                                const players = [event.target, player];
                                let index = 0;
                                while (true) {
                                    const npc = players[index];
                                    const { result } = await npc
                                        .chooseToRespond('打出两张更大的同点数扑克,否则受到2点伤害', 2, (c) => {
                                            if (ui.selected.cards.length) {
                                                return c.name == 'pukepai' && c.number == ui.selected.cards[0].number;
                                            }
                                            return c.name == 'pukepai' && c.number > num;
                                        })
                                        .set('complexCard', true); //filtercard里面调用ui.selected.cards,需要这个complexCard来刷新ui.selected.cards
                                    if (result?.cards?.length) {
                                        index = (index + 1) % 2;
                                        num = result.cards[0].number;
                                    } else {
                                        npc.damage();
                                        break;
                                    }
                                }
                            },
                            ai: {
                                order: 15,
                                result: {
                                    target: -2,
                                },
                            },
                        },
                        // 炸弹
                        // 将四张同点数扑克对一名其他角色使用,对目标造成2点伤害
                        pukepai_zhadan: {
                            enable: 'phaseUse',
                            filterCard(c, p) {
                                if (ui.selected.cards.length) {
                                    return c.name == 'pukepai' && c.number == ui.selected.cards[0].number;
                                }
                                const cards = p.getCards('hs', { name: 'pukepai' });
                                const counts = {};
                                for (const card of cards) {
                                    counts[card.number] = (counts[card.number] || 0) + 1;
                                }
                                const duplicates = cards.filter((card) => counts[card.number] > 3);
                                return c.name == 'pukepai' && duplicates.includes(c);
                            },
                            selectCard: 4,
                            position: 'hs',
                            filterTarget(card, player, target) {
                                return target != player;
                            },
                            selectTarget: 1,
                            filter(event, player) {
                                const counts = {};
                                for (const card of player.getCards('hs', { name: 'pukepai' })) {
                                    const num = card.number;
                                    counts[num] = (counts[num] || 0) + 1;
                                    if (counts[num] >= 4) {
                                        return true;
                                    }
                                }
                                return false;
                            },
                            prompt: '将四张同点数扑克对一名其他角色使用,对目标造成2点伤害',
                            async content(event, trigger, player) {
                                event.target.damage(2);
                            },
                            ai: {
                                order: 20,
                                result: {
                                    target: -4,
                                },
                            },
                        },
                        // 王炸
                        // 将大王小王对一名其他角色使用,对目标造成4点伤害,并且对目标相邻的角色造成一点伤害
                        pukepai_wangzha: {
                            enable: 'phaseUse',
                            filterCard(c) {
                                return c.name == 'pukepai' && [14, 15].includes(c.number);
                            },
                            selectCard: 2,
                            position: 'hs',
                            filterTarget(card, player, target) {
                                return target != player;
                            },
                            selectTarget: 1,
                            filter(event, player) {
                                const cards = player.getCards('hs', { name: 'pukepai' });
                                return [14, 15].every((num) => cards.some((c) => c.number == num));
                            },
                            prompt: '将大王小王对一名其他角色使用,对目标造成4点伤害,并且对目标相邻的角色造成一点伤害',
                            async content(event, trigger, player) {
                                event.target.damage(4);
                                if (event.target.next) {
                                    event.target.next.damage();
                                }
                                if (event.target.previous) {
                                    event.target.previous.damage();
                                }
                            },
                            ai: {
                                order: 30,
                                result: {
                                    player(player, target, card) {
                                        let num = 0;
                                        if (target.next) {
                                            num += 2 * sgn(target.next.isEnemiesOf(player));
                                        }
                                        if (target.previous) {
                                            num += 2 * sgn(target.previous.isEnemiesOf(player));
                                        }
                                        return num;
                                    },
                                    target: -8,
                                },
                            },
                        },
                        //————————————————————————————————————————————阿米娅·炉芯终曲 血量:1000/1000 势力:神
                        // 不应存在之人
                        // ①你始终拥有50%减伤
                        // ②限定技,当血量低于50%时,获得无敌状态【当体力值减少时防止之】直到本轮结束
                        HL_buyingcunzai: {
                            init(player) {
                                ui.background.style.backgroundImage = `url(extension/火灵月影/image/HL_amiya1.jpg)`;
                                ui.backgroundMusic.src = `extension/火灵月影/BGM/HL_amiya.mp3`;
                                ui.backgroundMusic.loop = true;
                            },
                            trigger: {
                                player: ['damageBegin4'],
                            },
                            forced: true,
                            lastDo: true,
                            mark: true,
                            intro: {
                                name: '无敌',
                                content(storage, player) {
                                    if (player.wudi) {
                                        return '本轮阿米娅处于无敌状态';
                                    }
                                    return '当前阿米娅未处于无敌状态';
                                },
                            },
                            filter(event, player) {
                                return player.wudi || event.num > 1;
                            },
                            async content(event, trigger, player) {
                                if (player.wudi) {
                                    trigger.cancel();
                                } else {
                                    trigger.num = Math.ceil(trigger.num / 2);
                                }
                            },
                            group: ['bosshp', 'bossfinish', 'HL_buyingcunzai_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['changeHp', 'damageBefore'],
                                    },
                                    filter(event, player) {
                                        return player.hp < player.maxHp / 2 && !player.storage.HL_buyingcunzai_1;
                                    },
                                    forced: true,
                                    limited: true,
                                    async content(event, trigger, player) {
                                        player.awakenSkill('HL_buyingcunzai_1');
                                        player.wudi = true;
                                        player.when({ global: 'roundStart' }).then(() => (player.wudi = false));
                                        player.hp = Math.ceil(player.maxHp / 2);
                                        player.update();
                                    },
                                },
                            },
                        },
                        //仅剩的创意:
                        //①游戏开始时你获得3枚<仅剩的创意>,将场上所有角色势力锁定为<神>,并令全场其他角色获得<束缚>状态直到你造成伤害后解除
                        //②每轮开始时或造成伤害/体力变化后,你获得等量的<仅剩的创意>并摸等量的牌
                        //③你的手牌上限等于<仅剩的创意>数
                        //④准备阶段,你消耗3枚<仅剩的创意>对全场其他角色各造成1点伤害
                        HL_chuangyi: {
                            mod: {
                                maxHandcard(player, num) {
                                    return numberq1(player.storage.HL_chuangyi);
                                },
                            },
                            trigger: {
                                global: ['roundStart'],
                                player: ['changeHp'],
                                source: ['damageBefore'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content: '#',
                            },
                            async content(event, trigger, player) {
                                const num = numberq1(trigger.num);
                                player.addMark('HL_chuangyi', num);
                                player.draw(Math.min(num, 20));
                            },
                            group: ['HL_chuangyi_1', 'HL_chuangyi_2'],
                            subSkill: {
                                //②每次消耗<仅剩的创意>时伤害+X(X为1~7的随机值,存活的角色越多此伤害随机加成越低)
                                1: {
                                    trigger: {
                                        player: ['phaseZhunbeiBegin'],
                                    },
                                    check: (event, player) => Math.random() > 0.5,
                                    filter: (event, player) => player.storage.HL_chuangyi > 2,
                                    async content(event, trigger, player) {
                                        function generateX(y) {
                                            const weights = Array.from({ length: 7 }, (_, i) => (8 - i) * y);
                                            const total = weights.reduce((a, b) => a + b, 0);
                                            let rand = Math.random() * total;
                                            return weights.findIndex((w) => (rand -= w) < 0) + 1;
                                        }
                                        player.storage.HL_chuangyi -= 3;
                                        for (const npc of player.getEnemies()) {
                                            let num = 1;
                                            if (player.hasSkill('HL_heiguan')) {
                                                num += generateX(game.players.length);
                                            }
                                            npc.damage(num);
                                        }
                                    },
                                },
                                2: {
                                    trigger: {
                                        global: ['gameStart'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.addMark('HL_chuangyi', 3);
                                        for (const npc of game.players) {
                                            if (npc != player) {
                                                npc.addSkill('HL_chuangyi_3');
                                            }
                                            Reflect.defineProperty(npc, 'group', {
                                                get() {
                                                    return 'shen';
                                                },
                                                set() { },
                                            });
                                        }
                                        player.when({ source: 'damageAfter' }).then(() => {
                                            for (const npc of game.players.filter((q) => q != player)) {
                                                npc.removeSkill('HL_chuangyi_3');
                                            }
                                        });
                                    },
                                },
                                3: {
                                    mark: true,
                                    marktext: '束缚',
                                    intro: {
                                        content: '无法使用打出弃置牌',
                                    },
                                    mod: {
                                        cardEnabled2(card, player) {
                                            return false;
                                        },
                                        cardDiscardable(card, player) {
                                            return false;
                                        },
                                    },
                                }, //束缚
                            },
                        },
                        // 尽头重现:
                        // 准备阶段,当<仅剩的创意>达到30枚或以上时,每消耗30枚<仅剩的创意>随机召唤一位随从加入战斗,每名随从限一次
                        HL_jintouchongxian: {
                            _priority: 9,
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            init(player) {
                                player.storage.HL_jintouchongxian = ['HL_shengwei', 'HL_kuilong', 'HL_heiguanzunzhu', 'HL_manfuleide'];
                            },
                            filter: (event, player) => player.storage.HL_chuangyi > 29 && player.storage.HL_jintouchongxian?.length,
                            mark: true,
                            intro: {
                                name: '随从',
                                content(storage, player) {
                                    if (player.storage.HL_jintouchongxian?.length) {
                                        return `当前还可召唤随从${get.translation(player.storage.HL_jintouchongxian)}`;
                                    }
                                    return '没有可召唤的随从';
                                },
                            },
                            async content(event, trigger, player) {
                                player.storage.HL_chuangyi -= 30;
                                const name = player.storage.HL_jintouchongxian.randomRemove();
                                const npc = player.addFellow(name);
                                npc.addSkill('HL_guiluan');
                            },
                        },
                        // 存续先兆:
                        // 蓄力技(0/10),结束阶段,若蓄力值已满消耗所有蓄力值随机令一名非随从其他角色所有技能失效并死亡.每名随从死亡时增加五点蓄力值
                        HL_cunxuxianzhao: {
                            chargeSkill: 10,
                            trigger: {
                                player: ['phaseJieshuBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return player.countCharge() > 9;
                            },
                            async content(event, trigger, player) {
                                player.removeCharge(10);
                                const npc = player.getEnemies().randomGet();
                                if (npc) {
                                    npc.CS();
                                    player.line(npc);
                                    const next = game.createEvent('diex', false);
                                    next.source = player;
                                    next.player = npc;
                                    next._triggered = null;
                                    await next.setContent(lib.element.content.die);
                                }
                            },
                            group: ['HL_cunxuxianzhao_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['die'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.boss == player;
                                    },
                                    async content(event, trigger, player) {
                                        player.addCharge(5);
                                    },
                                },
                            },
                        },
                        // 无终
                        // 觉醒技,当你体力值不大于0时将体力值回复至上限,获得技能【黑冠余威】,【无言的期盼】和【永恒存续】,重置技能【不应存在之人】
                        HL_wuzhong: {
                            forced: true,
                            juexingji: true,
                            trigger: {
                                player: ['changeHp', 'damageBefore'],
                            },
                            filter(event, player) {
                                return player.hp < 1 && !player.storage.HL_wuzhong;
                            },
                            async content(event, trigger, player) {
                                player.awakenSkill('HL_wuzhong');
                                document.body.HL_BG('HL_amiya2');
                                player.node.avatar.HL_BG('HL_amiya1');
                                player.hp = player.maxHp;
                                player.update();
                                player.wudi = true;
                                player.when({ global: 'roundStart' }).then(() => (player.wudi = false));
                                player.restoreSkill('HL_buyingcunzai_1');
                                lib.character.HL_amiya.skills.addArray(['HL_heiguan', 'HL_qipan', 'HL_yongheng']);
                                game.skangxing(player);
                                for (const npc of player.getEnemies()) {
                                    npc.loseHp(Math.ceil(npc.hp / 2));
                                }
                            },
                        },
                        // 黑冠余威:
                        // ①当体力值首次回复至上限后立即令全场其他角色失去一半体力值
                        // ②每次消耗<仅剩的创意>时伤害+X(X为1~7的随机值,存活的角色越多此伤害随机加成越低)
                        HL_heiguan: {},
                        // 无言的期盼:
                        // 结束阶段开始时,若场上有其他角色的手牌数大于/小于你,则令所有其他角色将手牌数弃置/摸至与你相等
                        HL_qipan: {
                            _priority: 9,
                            trigger: {
                                player: ['phaseJieshuBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                for (const npc of game.players.filter((q) => q.countCards('h') != player.countCards('h'))) {
                                    const num = npc.countCards('h') - player.countCards('h');
                                    if (num > 0) {
                                        await npc.chooseToDiscard(num, 'h', true);
                                    } else {
                                        npc.draw(-num);
                                    }
                                }
                            },
                        },
                        // 永恒存续
                        // 限定技,当你死亡前,
                        // 若你为BOSS,令所有其他角色死亡,视盟军胜利
                        // 否则令所有其他角色失去所有体力值,你回复等量体力并摸等量的牌
                        HL_yongheng: {
                            trigger: {
                                player: ['dieBegin'],
                            },
                            limited: true,
                            forced: true,
                            forceDie: true,
                            filter(event, player, name) {
                                return player.hp < 1 && !player.storage.yongheng;
                            },
                            async content(event, trigger, player) {
                                player.awakenSkill('HL_yongheng');
                                trigger.cancel();
                                if (game.boss == player) {
                                    game.checkResult = game.kongfunc;
                                    for (const npc of game.players.filter((q) => q != player)) {
                                        player.line(npc);
                                        const next = game.createEvent('diex', false);
                                        next.source = player;
                                        next.player = npc;
                                        next._triggered = null;
                                        await next.setContent(lib.element.content.die);
                                    }
                                    game.over('阿米娅被击败了');
                                } else {
                                    let num = 0;
                                    for (const npc of game.players.filter((q) => q != player)) {
                                        num += npc.hp;
                                        npc.loseHp(npc.hp);
                                    }
                                    player.recover(num);
                                    player.draw(Math.min(num, 20));
                                }
                            },
                        },
                        //当你使用【杀】、【决斗】、【过河拆桥】、【顺手牵羊】和【逐近弃远】时,若场上有未成为目标的敌方角色,你令这些角色也成为此牌目标
                        HL_guiluan: {
                            trigger: { player: 'useCard' },
                            filter(event, player) {
                                if (!['sha', 'juedou', 'guohe', 'shunshou', 'zhujinqiyuan'].includes(event.card.name)) return false;
                                return event.targets && player.getEnemies().some((q) => !event.targets.includes(q));
                            },
                            forced: true,
                            usable: 4,
                            async content(event, trigger, player) {
                                trigger.targets.addArray(player.getEnemies());
                            },
                        },
                        //————————————————————————————————————————————博卓卡斯替·圣卫铳骑 血量:30/30 势力:神
                        // 劝谕:
                        // 敌方角色使用伤害牌时只能指定你为目标,且其进入濒死状态时需额外使用一张回复类实体牌
                        HL_quanyu: {
                            global: ['HL_quanyu_1'],
                            subSkill: {
                                1: {
                                    mod: {
                                        playerEnabled(card, player, target) {
                                            const q = game.players.find((i) => i.hasSkill('HL_quanyu'));
                                            if (q && player.isEnemiesOf(q)) {
                                                if (target != q && get.tag(card, 'damage')) return false;
                                            }
                                        },
                                        targetEnabled(card, player, target) {
                                            const q = game.players.find((i) => i.hasSkill('HL_quanyu'));
                                            if (q && player.isEnemiesOf(q)) {
                                                if (target != q && get.tag(card, 'damage')) return false;
                                            }
                                        },
                                    },
                                    trigger: {
                                        player: ['useCardToBefore'],
                                    },
                                    filter(event, player) {
                                        const evt = event.getParent('_save');
                                        return evt.name && event.target == evt.dying;
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.baseDamage = numberq1(trigger.baseDamage) / 2;
                                    },
                                },
                            },
                        },
                        // 照护:
                        // 受到与你距离为2及其以上的敌方角色的伤害至多为1;敌方角色受到你造成的伤害之后直到下回合之前其造成和受到的伤害+1
                        HL_zhaohu: {
                            _priority: 76,
                            trigger: {
                                player: ['damageBegin4'],
                                source: ['damageBefore'],
                            },
                            filter(event, player) {
                                if (event.player == player) {
                                    return event.num > 1 && event.source?.isEnemiesOf(player) && get.distance(player, event.source) > 1;
                                }
                                return true;
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (trigger.player == player) {
                                    trigger.num = 1;
                                } else {
                                    trigger.player.addTempSkill('HL_zhaohu_1', { player: 'phaseBegin' });
                                }
                            },
                            subSkill: {
                                1: {
                                    _priority: 8,
                                    trigger: {
                                        player: ['damageBegin4'],
                                        source: ['damageBefore'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.num++;
                                    },
                                },
                            },
                        },
                        //————————————————————————————————————————————奎隆·魔诃萨埵权化 血量:30/30 势力:神
                        // 惩戒:
                        // 当你使用负收益牌指定敌方角色时,该牌额外结算四次
                        HL_chengjie: {
                            trigger: {
                                player: ['useCard'],
                            },
                            filter(event, player) {
                                if (event.card && !['equip', 'delay'].includes(get.type(event.card))) {
                                    _status.event.player = player;
                                    return event.targets?.some((t) => get.effect(t, event.card, player, t) < 0 && t.isEnemiesOf(player));
                                }
                            },
                            _priority: 23,
                            forced: true,
                            async content(event, trigger, player) {
                                trigger.effectCount += 4;
                            },
                        },
                        //————————————————————————————————————————————特雷西斯·黑冠尊主 血量:30/30 势力:神
                        // 征服:
                        // 你视为拥有技能【无双】,【铁骑】,【破军】,【强袭】
                        HL_zhengfu: {
                            init(player) {
                                for (const skill of ['wushuang', 'repojun', 'sbtieji', 'olqiangxi']) {
                                    player.addSkill(skill);
                                }
                            },
                        },
                        //————————————————————————————————————————————曼弗雷德 血量:30/30 势力:神
                        // 军事训练:
                        // ①你视为装备【先天八卦阵】
                        // ②造成伤害时有50%替换为随机属性伤害
                        // ③你受到【杀】的伤害后此技能失效直到本轮结束
                        HL_junshixunlian: {
                            _priority: 8,
                            trigger: {
                                player: ['damageBegin4'],
                                source: ['damageBefore'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (trigger.player == player) {
                                    if (trigger.card?.name == 'sha') {
                                        player.tempBanSkill('HL_junshixunlian', { global: 'roundStart' });
                                        player.tempBanSkill('rw_bagua_skill', { global: 'roundStart' });
                                    }
                                } else {
                                    if (Math.random() > 0.5) {
                                        trigger.nature = Array.from(lib.nature.keys()).randomGet();
                                    }
                                }
                            },
                            group: ['rw_bagua_skill'],
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————抗性测试
                        HL_miaosha: {
                            enable: 'phaseUse',
                            usable: 1,
                            filterTarget: true,
                            selectTarget: 1,
                            async content(event, trigger, player) {
                                const skill = event.target.GS();
                                game.expandSkills(skill);
                                for (const x of skill) {
                                    Reflect.defineProperty(lib.skill, x, {
                                        get() {
                                            return {};
                                        },
                                        set() { },
                                    });
                                }
                                for (const key in lib.hook) {
                                    if (key.startsWith(event.target.playerid)) {
                                        Reflect.defineProperty(lib.hook, key, {
                                            get() {
                                                return [];
                                            },
                                            set() { },
                                        });
                                    }
                                }
                                for (const hook in lib.hook.globalskill) {
                                    if (lib.hook.globalskill[hook].some((q) => skill.includes(q))) {
                                        Reflect.defineProperty(lib.hook.globalskill, hook, {
                                            get() {
                                                return [];
                                            },
                                            set() { },
                                        });
                                    }
                                }
                                Reflect.defineProperty(event.target, 'skills', {
                                    get() {
                                        return [];
                                    },
                                    set() { },
                                });
                                Reflect.defineProperty(event.target, 'invisibleSkills', {
                                    get() {
                                        return [];
                                    },
                                    set() { },
                                });
                                Reflect.defineProperty(event.target, 'hiddenSkills', {
                                    get() {
                                        return [];
                                    },
                                    set() { },
                                });
                                Reflect.defineProperty(event.target, 'tempSkills', {
                                    get() {
                                        return {};
                                    },
                                    set() { },
                                });
                                Reflect.defineProperty(event.target, 'additionalSkills', {
                                    get() {
                                        return new Proxy(
                                            {},
                                            {
                                                get(u, i) {
                                                    return [];
                                                },
                                            }
                                        );
                                    },
                                    set() { },
                                });
                                //await lib.element.player.die.call(event.target);
                                if (game.players.includes(event.target)) {
                                    const index = game.players.indexOf(event.target);
                                    game.players.splice(index, 1);
                                } //如果这两步合成一步,那么修改的数组就是上一次getter的数组而不是game.players,导致修改失败
                                if (!game.dead.includes(event.target)) {
                                    game.dead.unshift(event.target);
                                }
                                let class1 = window.Element.prototype.getAttribute.call(event.target, 'class');
                                window.Element.prototype.setAttribute.call(event.target, 'class', (class1 += ' dead'));
                                if (lib.element.player.dieAfter) {
                                    lib.element.player.dieAfter.call(event.target);
                                }
                                if (lib.element.player.dieAfter2) {
                                    lib.element.player.dieAfter2.call(event.target);
                                }
                                lib.element.player.$die.call(event.target);
                                const stat = player.stat;
                                const statx = stat[stat.length - 1];
                                if (!statx.kill) {
                                    statx.kill = 1;
                                } else {
                                    statx.kill++;
                                }
                                game.log(event.target, '被', player, '杀害');
                            },
                            ai: {
                                order: 99,
                                result: {
                                    target: -99,
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————HL_ws_bossjieshao
                        HL_ws_bossjieshao: {},
                        //——————————————————————————————————————————————————————————————————————————————————————————————————焚城魔士
                        // 登场时,对所有敌方角色各造成三点火焰伤害.
                        // 焚城:准备阶段,连续进行四次判定,对所有敌方角色造成相当于判定结果中♥️️️牌数点火焰伤害
                        HL_fencheng: {
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.damage(3, 'fire');
                                }
                            },
                            trigger: {
                                player: ['phaseZhunbeiBefore'],
                            },
                            forced: true,
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            async content(event, trigger, player) {
                                let num = 4;
                                let numx = 0;
                                while (num-- > 0) {
                                    const {
                                        result: { suit },
                                    } = await player.judge('焚城', (card) => (card.suit == 'heart' ? 2 : 0));
                                    if (suit == 'heart') {
                                        numx++;
                                    }
                                }
                                if (numx > 0) {
                                    for (const npc of player.getEnemies()) {
                                        npc.damage(numx, 'fire');
                                    }
                                }
                            },
                            group: ['bosshp', 'bossfinish'],
                        },
                        // 绝策:二阶段解锁,每名角色结束阶段,你令所有此回合失去过牌的角色各失去一点体力
                        HL_juece: {
                            trigger: {
                                global: ['phaseAfter'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.players.some((npc) => {
                                    const his = npc.actionHistory;
                                    return his[his.length - 1].lose.length;
                                });
                            },
                            async content(event, trigger, player) {
                                const npcs = game.players.filter((npc) => {
                                    const his = npc.actionHistory;
                                    return his[his.length - 1].lose.length;
                                });
                                for (const npc of npcs) {
                                    npc.loseHp();
                                }
                            },
                        },
                        // 灭计:三阶段解锁,准备阶段,你展示一名敌方角色的手牌,弃置里面所有基本牌,获得其中所有锦囊牌
                        HL_mieji: {
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.players.some((npc) => npc.isEnemiesOf(player) && npc.countCards('h'));
                            },
                            async content(event, trigger, player) {
                                const {
                                    result: { targets },
                                } = await player.chooseTarget('展示一名敌方角色的手牌,弃置里面所有基本牌,获得其中所有锦囊牌', (c, p, npc) => npc.isEnemiesOf(p) && npc.countCards('h')).set('ai', (t) => -get.attitude(player, t));
                                if (targets && targets[0]) {
                                    const cards = targets[0].getCards('h');
                                    player.showCards(cards);
                                    targets[0].discard(cards.filter((q) => get.type(q) == 'basic'));
                                    player.gain(
                                        cards.filter((q) => get.type(q) == 'trick'),
                                        'gain2'
                                    );
                                }
                            },
                        },
                        // 鸩帝:四阶段解锁,其他角色准备阶段,你将一张【毒】从游戏外加入于其手牌中,有【毒】进入弃牌堆时,你下一次造成的伤害+1
                        HL_zhendi: {
                            trigger: {
                                global: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player != player;
                            },
                            async content(event, trigger, player) {
                                trigger.player.gain(game.createCard('du'), 'gain2');
                            },
                            group: ['HL_zhendi_1', 'HL_zhendi_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['loseEnd'],
                                    },
                                    forced: true,
                                    mark: true,
                                    intro: {
                                        name: '鸩帝',
                                        content: 'mark',
                                    },
                                    filter(event, player) {
                                        return event.cards?.some((q) => q.name == 'du');
                                    },
                                    async content(event, trigger, player) {
                                        player.addMark('HL_zhendi_1', trigger.cards.filter((q) => q.name == 'du').length);
                                    },
                                },
                                2: {
                                    trigger: {
                                        source: ['damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.storage.HL_zhendi_1 > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num += player.storage.HL_zhendi_1;
                                        player.storage.HL_zhendi_1 = 0;
                                    },
                                },
                            },
                        },
                        // 毒酒:炼狱模式解锁,游戏开始时,你将牌堆里所有【酒】替换为【毒】,将12张【毒】加入游戏,我方角色使用【毒】时,改为回复两点体力
                        HL_dujiu: {
                            trigger: {
                                global: ['gameStart'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                for (const card of Array.from(ui.cardPile.childNodes)) {
                                    if (card.name == 'jiu') {
                                        card.init([card.suit, card.number, 'du', card.nature]);
                                    }
                                }
                                let num = 12;
                                while (num-- > 0) {
                                    ui.cardPile.insertBefore(game.createCard('du'), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
                                }
                            },
                            group: ['HL_dujiu_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['g_duBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.isFriendsOf(player);
                                    },
                                    async content(event, trigger, player) {
                                        trigger.cancel();
                                        trigger.player.recover(2);
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————乱武毒士群60勾玉
                        // 登场时,为所有敌方角色附加三层<重伤>效果.(重伤:回复体力时,将回复值设定为0并移除一层<重伤>)
                        // 乱武:准备阶段,你令所有敌方角色依次选择一项:①本回合无法使用【桃】,失去一点体力②对一名友方角色使用一张【杀】.选择结束后,你摸相当于选择①角色数量张牌,视作依次使用选择②角色数量张【杀】
                        HL_luanwu: {
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.addMark('HL_luanwu', 3);
                                }
                            },
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            mark: true,
                            intro: {
                                name: '重伤',
                                content: 'mark',
                            },
                            async content(event, trigger, player) {
                                let num1 = 0,
                                    num2 = 0;
                                for (const npc of player.getEnemies()) {
                                    const { result } = await npc
                                        .chooseToUse(
                                            '对一名友方角色使用一张【杀】,否则本回合无法使用【桃】,失去一点体力',
                                            (card) => card.name == 'sha',
                                            (c, p, target) => target.isFriendsOf(npc)
                                        )
                                        .set('ai2', function () {
                                            return 1;
                                        });
                                    if (result?.card) {
                                        num2++;
                                    } else {
                                        num1++;
                                        npc.addTempSkill('HL_luanwu_1');
                                        npc.loseHp();
                                    }
                                }
                                player.draw(num1);
                                while (num2-- > 0) {
                                    await player.chooseUseTarget({ name: 'sha' }, true, false, 'nodistance');
                                }
                            },
                            group: ['HL_luanwu_2', 'bosshp', 'bossfinish'],
                            subSkill: {
                                1: {
                                    mod: {
                                        cardEnabled2(card, player) {
                                            if (card.name == 'tao') {
                                                return false;
                                            }
                                        },
                                    },
                                },
                                2: {
                                    trigger: {
                                        global: ['recoverBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.storage.HL_luanwu > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.cancel();
                                        trigger.player.removeMark('HL_luanwu');
                                    },
                                },
                            },
                        },
                        // 完杀:二阶段解锁,你的回合内,敌方角色回复体力后,若其不处于濒死状态,你令其失去一点体力,若其仍处于濒死状态,你令其获得一层<重伤>
                        HL_wansha: {
                            trigger: {
                                global: ['recoverEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return player == _status.currentPhase && event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                if (trigger.player.hp > 0) {
                                    trigger.player.loseHp();
                                } else {
                                    trigger.player.addMark('HL_luanwu');
                                }
                            },
                        },
                        // 帷幕:三阶段解锁,我方角色始终拥有1限伤,且每回合至多受到5次伤害
                        HL_weimu: {
                            trigger: {
                                global: ['damageBegin4'],
                            },
                            forced: true,
                            lastDo: true,
                            filter(event, player) {
                                return event.player.isFriendsOf(player);
                            },
                            async content(event, trigger, player) {
                                const his = trigger.player.actionHistory;
                                if (his[his.length - 1].damage.length > 4) {
                                    trigger.cancel();
                                }
                                if (trigger.num > 1) {
                                    trigger.num = 1;
                                }
                            },
                        },
                        // 惩雄:四阶段解锁,敌方角色使用于其摸牌阶段外获得的牌时,失去一点体力
                        HL_chengxiong: {
                            trigger: {
                                global: ['gainBefore'],
                            },
                            forced: true,
                            popup: false,
                            filter(event, player) {
                                return event.cards?.length && event.player.isEnemiesOf(player) && !event.getParent('phaseDraw').name;
                            },
                            async content(event, trigger, player) {
                                trigger.gaintag.add('HL_chengxiong');
                            },
                            group: ['HL_chengxiong_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['useCardBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.isEnemiesOf(player) && event.cards?.some((q) => q.gaintag.includes('HL_chengxiong'));
                                    },
                                    async content(event, trigger, player) {
                                        trigger.player.loseHp(trigger.cards.filter((q) => q.gaintag.includes('HL_chengxiong')).length);
                                    },
                                },
                            },
                        },
                        // 毒计:炼狱模式解锁,一名角色使用普通锦囊牌时,你进行一次判定,若为黑色,其失去一点体力,若为红色,你令一名角色回复一点体力
                        HL_duji: {
                            trigger: {
                                global: ['useCardBefore'],
                            },
                            forced: true,
                            filter(event, player) {
                                return get.type(event.card) == 'trick';
                            },
                            async content(event, trigger, player) {
                                const {
                                    result: { color },
                                } = await player.judge('毒计', (card) => 2);
                                if (color == 'black') {
                                    trigger.player.loseHp();
                                } else {
                                    const {
                                        result: { targets },
                                    } = await player.chooseTarget('令一名角色回复一点体力', (c, p, t) => t.hp < t.maxHp).set('ai', (t) => get.attitude(player, t));
                                    if (targets && targets[0]) {
                                        targets[0].recover();
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————镇关魔将群120勾玉
                        // 登场时,展示所有敌方角色的手牌并弃置其中的伤害牌
                        // 耀武:敌方角色使用伤害牌时,你取消所有目标,令此牌对你结算x次(x为此牌指定的目标数)
                        HL_yaowu: {
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.discard(npc.getCards('h', (c) => get.tag(c, 'damage')));
                                }
                            },
                            trigger: {
                                global: ['useCardBefore'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            filter(event, player) {
                                return event.player.isEnemiesOf(player) && get.tag(event.card, 'damage') && event.targets?.some((q) => q != player);
                            },
                            async content(event, trigger, player) {
                                let num = 0;
                                if (!trigger.excluded) {
                                    trigger.excluded = [];
                                }
                                for (const i of trigger.targets) {
                                    if (i != player) {
                                        num++;
                                        trigger.excluded.add(i);
                                    }
                                }
                                while (num-- > 0) {
                                    await trigger.player.quseCard(trigger.card, [player]);
                                }
                            },
                            group: ['bosshp', 'bossfinish'],
                        },
                        // 恃勇:二阶段解锁,当你受到伤害后,你摸一张牌,可以将一张牌当做【杀】对伤害来源使用,若此【杀】造成了伤害,你弃置其一张牌
                        HL_shiyong: {
                            trigger: {
                                player: ['damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return !event.getParent('HL_shiyong').name;
                            },
                            async content(event, trigger, player) {
                                player.draw();
                                if (player.countCards('he') && trigger.source) {
                                    const {
                                        result: { cards },
                                    } = await player.chooseCard('将一张牌当做【杀】对伤害来源使用', 'he').set('ai', (c) => -get.attitude(player, trigger.source) - get.value(c));
                                    if (cards && cards[0]) {
                                        const sha = player.useCard({ name: 'sha' }, cards, trigger.source, false);
                                        await sha;
                                        if (trigger.source.countCards('he')) {
                                            const his = trigger.source.actionHistory;
                                            for (const evt of his[his.length - 1].damage) {
                                                if (evt.getParent((e) => e == event)) {
                                                    player.discardPlayerCard(trigger.source, 'he', true);
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        // 势斩:三阶段解锁,敌方角色准备阶段,你摸三张牌,其视作依次对你使用两张【决斗】,你可以将一张黑色牌当做【杀】打出
                        HL_shizhan: {
                            trigger: {
                                global: ['phaseZhunbeiBefore'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                player.draw(3);
                                let num = 2;
                                while (num-- > 0) {
                                    await trigger.player.useCard({ name: 'juedou' }, player);
                                }
                            },
                            group: ['HL_shizhan_1'],
                            subSkill: {
                                1: {
                                    enable: ['chooseToRespond', 'chooseToUse'],
                                    filterCard(card, player) {
                                        if (get.zhu(player, 'shouyue')) return true;
                                        return get.color(card) == 'black';
                                    },
                                    position: 'hes',
                                    viewAs: { name: 'sha' },
                                    viewAsFilter(player) {
                                        if (get.zhu(player, 'shouyue')) {
                                            if (!player.countCards('hes')) return false;
                                        } else {
                                            if (!player.countCards('hes', { color: 'black' })) return false;
                                        }
                                    },
                                    prompt: '将一张黑色牌当杀使用或打出',
                                    check(card) {
                                        const val = get.value(card);
                                        if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                                        return 5 - val;
                                    },
                                    ai: {
                                        skillTagFilter(player, tag) {
                                            if (get.zhu(player, 'shouyue')) {
                                                if (!player.countCards('hes')) return false;
                                            } else {
                                                if (!player.countCards('hes', { color: 'black' })) return false;
                                            }
                                        },
                                        respondSha: true,
                                    },
                                },
                            },
                        },
                        // 扬威:四阶段解锁,敌方角色出牌阶段开始时,其需选择一项:①本回合使用基本牌②本回合使用非基本牌.其执行另外一项后,你对其造成一点伤害
                        HL_yangwei: {
                            trigger: {
                                global: ['phaseUseBefore'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                const list = ['①本回合使用基本牌', '②本回合使用非基本牌'];
                                const {
                                    result: { control },
                                } = await trigger.player
                                    .chooseControl(list)
                                    .set('prompt', `选择一项,本回合执行另外一项后,受到一点伤害`)
                                    .set('ai', (e, p) => {
                                        return list.randomGet();
                                    });
                                trigger.player.addTempSkill('HL_yangwei_2');
                                if (control == '①本回合使用基本牌') {
                                    trigger.player.storage.HL_yangwei_2 = false;
                                } else {
                                    trigger.player.storage.HL_yangwei_2 = true;
                                }
                            },
                            group: ['HL_yangwei_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['useCardEnd'], //金莲珠嵌套结算
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.isEnemiesOf(player) && event.player.hasSkill('HL_yangwei_2') && (get.type(event.card) == 'basic') == event.player.storage.HL_yangwei_2;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.player.damage();
                                    },
                                },
                                2: {
                                    mark: true,
                                    intro: {
                                        name: '扬威',
                                        content(storage, player) {
                                            if (player.storage.HL_yangwei_2) {
                                                return '本回合使用基本牌后受伤害';
                                            }
                                            return '本回合使用非基本牌后受伤害';
                                        },
                                    },
                                },
                            },
                        },
                        // 镇关:炼狱模式解锁,当你成为一张基本牌或普通锦囊牌的目标时,你进行一次判定,若为黑色,此牌对你无效
                        HL_zhenguan: {
                            trigger: {
                                target: ['useCardToPlayer'],
                            },
                            forced: true,
                            filter(event, player) {
                                return !['equip', 'delay'].includes(get.type(event.card)) && event.player != player;
                            },
                            async content(event, trigger, player) {
                                if (get.effect(player, trigger.card, trigger.player, player) < 0) {
                                    //FILTER里面放get.effect=>get.value出bug没有_status.event.player
                                    var E = get.cards(1);
                                    game.cardsGotoOrdering(E);
                                    player.showCards(E, '玲珑');
                                    if (get.color(E[0]) == 'black') {
                                        trigger.parent.excluded.add(player);
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————無雙飞将群80勾玉
                        // 登场时,视作依次使用四张【杀】
                        // 無雙
                        // 你使用【杀】指定敌方角色时,令其武将牌上的技能失效<br>你的【杀】需要x张【闪】来响应,基础伤害提高x点,可以额外指定至多x个目标(x为敌方角色数)
                        HL_wushuang: {
                            mod: {
                                selectTarget(card, player, range) {
                                    if (card.name == 'sha') {
                                        range[1] += player.getEnemies().length;
                                    }
                                },
                            },
                            trigger: {
                                player: ['useCardBefore'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            firstDo: true,
                            filter(event, player) {
                                return event.card.name == 'sha' && event.targets?.length;
                            },
                            async content(event, trigger, player) {
                                const targets = trigger.targets.filter((q) => q.isEnemiesOf(player));
                                for (const npc of targets) {
                                    if (!npc.storage.skill_blocker) {
                                        npc.storage.skill_blocker = [];
                                    }
                                    npc.storage.skill_blocker.add('HL_wushuang');
                                }
                                player
                                    .when({ player: 'useCardAfter' })
                                    .filter((e) => e == trigger)
                                    .then(() => {
                                        for (const npc of targets) {
                                            npc.storage.skill_blocker?.remove('HL_wushuang');
                                        }
                                    })
                                    .vars({ targets: targets });
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                            group: ['HL_wushuang_2', 'bosshp', 'bossfinish'],
                            subSkill: {
                                2: {
                                    init(player) {
                                        let num = 4;
                                        while (num-- > 0) {
                                            player.chooseUseTarget({ name: 'sha' }, true, false, 'nodistance');
                                        } //这里await但是init没有await,所以执行到chooseusetarget=>choosetarget=>get.effectuse的时候找不到当前事件card
                                    },
                                    trigger: {
                                        player: ['shaBefore'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        const num = player.getEnemies().length;
                                        trigger.baseDamage += num;
                                        trigger.shanRequired = 1 + num;
                                    },
                                },
                            },
                        },
                        // 无谋:二阶段解锁,你使用的除【决斗】以外的锦囊牌失效,使用的基本牌结算三次
                        HL_wumou: {
                            _priority: 6,
                            trigger: {
                                player: 'useCard',
                            },
                            forced: true,
                            filter(event, player) {
                                return ['basic', 'trick'].includes(get.type(event.card));
                            },
                            async content(event, trigger, player) {
                                if (get.type(trigger.card) == 'basic') {
                                    trigger.effectCount += 2;
                                } else {
                                    if (trigger.card.name != 'juedou') {
                                        trigger.cancel();
                                    }
                                }
                            },
                        },
                        // 极武:三阶段解锁,你使用伤害牌指定目标后,令这些角色各失去一点体力
                        HL_jiwu: {
                            _priority: 7,
                            trigger: {
                                player: 'useCardBefore',
                            },
                            forced: true,
                            filter(event, player) {
                                return get.tag(event.card, 'damage') && event.targets?.length;
                            },
                            async content(event, trigger, player) {
                                for (const npc of trigger.targets) {
                                    npc.loseHp();
                                }
                            },
                        },
                        // 利驭
                        // 四阶段解锁,每名角色回合限一次,你使用伤害牌指定其后,摸四张牌,出牌阶段出杀次数+1,防止此牌对其造成的伤害,你下一次造成的伤害翻倍
                        HL_liyu: {
                            _priority: 8,
                            mod: {
                                cardUsable(card, player, num) {
                                    if (card.name == 'sha') {
                                        return (num += player.storage.HL_liyu);
                                    }
                                },
                            },
                            init(player) {
                                player.storage.HL_liyu = 0;
                                player.storage.HL_liyu_1 = [];
                                player.storage.HL_liyu_2 = 0;
                            },
                            trigger: {
                                player: ['useCardToPlayer'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                name: '出杀',
                                content: 'mark',
                            },
                            filter(event, player) {
                                return get.tag(event.card, 'damage') && !player.storage.HL_liyu_1.includes(event.target);
                            },
                            async content(event, trigger, player) {
                                trigger.parent.excluded.add(trigger.target);
                                player.storage.HL_liyu_1.push(trigger.target);
                                player.storage.HL_liyu++;
                                player.storage.HL_liyu_2++;
                                player.draw(4);
                            },
                            group: ['HL_liyu_1', 'HL_liyu_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['phaseEnd'],
                                    },
                                    forced: true,
                                    popup: false,
                                    async content(event, trigger, player) {
                                        player.storage.HL_liyu_1 = [];
                                    },
                                },
                                2: {
                                    trigger: {
                                        source: 'damageBefore',
                                    },
                                    forced: true,
                                    mark: true,
                                    intro: {
                                        name: '伤害',
                                        content: 'mark',
                                    },
                                    filter(event, player) {
                                        return player.storage.HL_liyu_2 > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num = trigger.num * Math.pow(2, player.storage.HL_liyu_2);
                                    },
                                },
                            },
                        },
                        // 神威
                        // 炼狱模式解锁,其他角色准备阶段,你获得一张【杀】并可以使用之
                        HL_shenwei: {
                            _priority: 9,
                            trigger: {
                                global: 'phaseZhunbeiBefore',
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player != player;
                            },
                            async content(event, trigger, player) {
                                const sha = get.cardPile((c) => c.name == 'sha', 'field');
                                if (sha) {
                                    await player.gain(sha, 'gain2');
                                    player
                                        .chooseToUse('使用此【杀】', (card) => card == sha)
                                        .set('ai2', function (target) {
                                            if (target) {
                                                return -get.attitude(player, target);
                                            }
                                        });
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————封印之王座  神  500.0体力
                        // 圣者荣光
                        // 你拥有90%减伤和50限伤;体力值低于10%时,你召唤丰乐亭侯
                        HL_shengzhe: {
                            init(player) {
                                ui.background.setBackgroundImage('extension/火灵月影/image/bg_HL_wangzuo.jpg');
                            },
                            trigger: {
                                player: ['damageBegin4'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            lastDo: true,
                            async content(event, trigger, player) {
                                trigger.num = Math.min(trigger.num / 10, 50);
                            },
                            group: ['bosshp', 'bossfinish', 'HL_shengzhe_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['changeHp', 'damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.hp < 50 && !player.storage.HL_shengzhe_1;
                                    },
                                    juexingji: true,
                                    async content(event, trigger, player) {
                                        player.awakenSkill('HL_shengzhe_1');
                                        player.hp = 50;
                                        player.update();
                                        const boss = player.addFellow('HL_fengletinghou');
                                        boss.shibing = true;
                                        game.nkangxing(boss, 'HL_fengletinghou');
                                        game.skangxing(boss);
                                        boss.bosskangxing = true;
                                    },
                                },
                            },
                        },
                        // 王道权御
                        // 每轮开始时,若场上没有士兵,随机召唤一批次士兵
                        // 若场上有士兵,令所有士兵自爆
                        // 每自爆一个士兵的一点体力,对随机敌方单位造成1点伤害
                        // 批次1
                        // 王左右出现王者御卫,玩家两侧出现王者骁勇
                        // 批次2
                        // 王左右出现铁骨铮臣,玩家两侧出现兴国志士
                        // 批次3
                        // 王左右出现国之柱石(国之柱石标记数计三枚)
                        // 批次4
                        // 玩家两侧出现两个凡人之愿
                        HL_wangdao: {
                            trigger: {
                                global: ['roundStart'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (HL.wangzuoboss && game.players.includes(HL.wangzuoboss)) {
                                } else {
                                    HL.wangzuoboss = player;
                                } // 场上只能有一个boss
                                const shibing = game.players.filter((q) => q.shibing);
                                let numx = player.getEnemies().length;
                                if (shibing.length) {
                                    let num = 0;
                                    for (const i of shibing) {
                                        num += numberq1(i.hp);
                                        await i.die();
                                    }
                                    if (numx) {
                                        while (num > 0) {
                                            const num1 = Math.ceil(9 * Math.random());
                                            num -= num1;
                                            const npc = player.getEnemies().randomGet();
                                            if (npc) {
                                                await npc.damage(num1);
                                            }
                                        }
                                    }
                                } else {
                                    const num = [1, 2, 3, 4].randomGet();
                                    switch (num) {
                                        case 1:
                                            {
                                                player.addFellow('HL_yuwei').shibing = true;
                                                player.addFellow('HL_yuwei').shibing = true;
                                                while (numx-- > 0) {
                                                    player.addFellow(`HL_xiaoyong${[1, 2, 3].randomGet()}`).shibing = true;
                                                }
                                            }
                                            break;
                                        case 2:
                                            {
                                                player.addFellow('HL_zhengchen').shibing = true;
                                                player.addFellow('HL_zhengchen').shibing = true;
                                                while (numx-- > 0) {
                                                    player.addFellow('HL_zhishi').shibing = true;
                                                }
                                            }
                                            break;
                                        case 3:
                                            {
                                                player.addFellow('HL_zhushi').shibing = true;
                                                player.addFellow('HL_zhushi').shibing = true;
                                            }
                                            break;
                                        case 4:
                                            {
                                                let numq = 2 * numx;
                                                while (numq-- > 0) {
                                                    player.addFellow('HL_fanren').shibing = true;
                                                }
                                            }
                                            break;
                                    }
                                }
                            },
                        },
                        // 勠力同心
                        // 你回合结束后,令所有士兵依次执行一个回合
                        // 士兵回合结束后,令你执行一个额外的摸牌阶段与出牌阶段.
                        HL_tongxin: {
                            trigger: {
                                player: ['phaseAfter'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.players.some((q) => q.shibing);
                            },
                            async content(event, trigger, player) {
                                for (const npc of game.players.filter((q) => q.shibing)) {
                                    await npc.phase('nodelay');
                                }
                            },
                            group: ['HL_tongxin_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['phaseAfter'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.shibing;
                                    },
                                    async content(event, trigger, player) {
                                        await player.phaseDraw();
                                        await player.phaseUse();
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者御卫  神  30体力
                        // 拂士
                        //免疫王受到的伤害;造成伤害时,令王回复等量体力
                        HL_fushi: {
                            trigger: {
                                global: ['damageBegin4'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player == HL.wangzuoboss;
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['HL_fushi_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        source: ['damage'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.wangzuoboss;
                                    },
                                    async content(event, trigger, player) {
                                        const num = numberq1(trigger.num);
                                        HL.wangzuoboss.recover(num);
                                    },
                                },
                            },
                        },
                        // 镇恶
                        //敌方角色结束阶段,若其本回合造成了伤害,你视作对其使用一张【杀】,期间其技能失效
                        HL_zhene: {
                            trigger: {
                                global: ['phaseJieshuBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                const his = event.player.actionHistory;
                                const evt = his[his.length - 1];
                                return event.player.isEnemiesOf(player) && evt.sourceDamage.length;
                            },
                            async content(event, trigger, player) {
                                if (!trigger.player.storage.skill_blocker) {
                                    trigger.player.storage.skill_blocker = [];
                                }
                                trigger.player.storage.skill_blocker.add('HL_zhene');
                                await player.useCard({ name: 'sha' }, trigger.player);
                                trigger.player.storage.skill_blocker?.remove('HL_zhene');
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                        },
                        // 蒙光
                        //王的出牌阶段结束后,回复一点体力
                        HL_mengguang: {
                            trigger: {
                                global: ['phaseUseEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player == HL.wangzuoboss;
                            },
                            async content(event, trigger, player) {
                                trigger.player.recover();
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者骁勇  神  6体力(刀/枪/弓随机之一)
                        // 金刀
                        //你使用伤害牌指定敌方角色时,将其所有牌移出游戏直到此回合结束,你对牌数小于你的敌方角色造成的伤害翻倍
                        HL_jindao: {
                            trigger: {
                                player: ['useCardToPlayer'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.target.isEnemiesOf(player) && event.target.countCards('he');
                            },
                            async content(event, trigger, player) {
                                const cards = trigger.target.getCards('he');
                                await trigger.target.lose(cards, ui.special);
                                trigger.target
                                    .when({ global: 'phaseAfter' })
                                    .then(() => {
                                        player.gain(cards, 'gain2');
                                    })
                                    .vars({ cards: cards });
                            },
                            group: ['HL_jindao_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        source: ['damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.isEnemiesOf(player) && event.player.countCards('he') < player.countCards('he');
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num = numberq1(trigger.num) * 2;
                                    },
                                },
                            },
                        },
                        // 金枪
                        //你使用或打出【杀】/【闪】时,获得对方一张牌,你可以将一张基本牌当做【杀】/【闪】使用或打出
                        HL_jinqiang: {
                            enable: ['chooseToUse', 'chooseToRespond'],
                            hiddenCard(player, name) {
                                return player.countCards('he', { type: 'basic' }) && ['sha', 'shan'].includes(name);
                            },
                            filter(event, player) {
                                return player.countCards('he', { type: 'basic' }) && ['sha', 'shan'].some((q) => player.filterCard(q));
                            },
                            chooseButton: {
                                dialog(event, player) {
                                    return ui.create.dialog('金枪', [player.qcard().filter((q) => ['sha', 'shan'].includes(q[2])), 'vcard']);
                                },
                                check(button) {
                                    const player = _status.event.player;
                                    const num = player.getUseValue(
                                        {
                                            name: button.link[2],
                                            nature: button.link[3],
                                        },
                                        null,
                                        true
                                    );
                                    return number0(num) + 10;
                                },
                                backup(links, player) {
                                    return {
                                        filterCard(c) {
                                            return get.type(c) == 'basic';
                                        },
                                        selectCard: 1,
                                        position: 'he',
                                        check: (card) => 12 - get.value(card),
                                        viewAs: {
                                            name: links[0][2],
                                            nature: links[0][3],
                                            suit: links[0][0],
                                            number: links[0][1],
                                        },
                                    };
                                },
                                prompt(links, player) {
                                    return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                                },
                            },
                            ai: {
                                fireAttack: true,
                                respondSha: true,
                                respondShan: true,
                                skillTagFilter(player, tag, arg) {
                                    return Boolean(player.countCards('he', { type: 'basic' }));
                                },
                                order: 10,
                                result: {
                                    player: 1,
                                },
                            },
                            group: ['HL_jinqiang_1'],
                            subSkill: {
                                1: {
                                    trigger: { player: ['useCard', 'respond'] },
                                    filter(event, player) {
                                        return ['sha', 'shan'].includes(event.card.name) && lib.skill.HL_jinqiang_1.logTarget(event, player)?.countCards('he');
                                    },
                                    forced: true,
                                    logTarget(event, player) {
                                        if (event.name == 'respond') return event.source;
                                        if (event.card.name == 'sha') return event.targets[0];
                                        return event.respondTo[0];
                                    },
                                    async content(event, trigger, player) {
                                        player.gainPlayerCard(lib.skill.HL_jinqiang_1.logTarget(trigger, player), 'he');
                                    },
                                },
                            },
                        },
                        // 金弓
                        //你使用【杀】指定敌方角色时,你本回合每使用过一个花色的牌,此【杀】伤害+1.
                        HL_jingong: {
                            trigger: {
                                player: ['shaBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.target?.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                const his = player.actionHistory;
                                const evt = his[his.length - 1];
                                const num = evt.useCard.map((e) => e.card?.suit).unique().length;
                                trigger.baseDamage += num;
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————铁骨铮臣  神  24体力
                        // 铮骨
                        //受到伤害/体力流失/体力调整时,改为失去一点体力
                        HL_zhenggu: {
                            trigger: {
                                player: ['loseHpBegin', 'damageBegin4', 'changeHpBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                if (event.name == 'changeHp' && event.num > 0) {
                                    return false;
                                }
                                return !event.getParent('HL_zhenggu', true);
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                                player.loseHp();
                            },
                        },
                        // 切言
                        //准备阶段,你随机展示三张普通锦囊牌,并令王选择其中一张使用之;若王拒绝使用,你失去一点体力
                        HL_qieyan: {
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return HL.wangzuoboss;
                            },
                            async content(event, trigger, player) {
                                const cards = Array.from(ui.cardPile.childNodes)
                                    .filter((c) => get.type(c) == 'trick')
                                    .randomGets(3);
                                if (cards.length) {
                                    game.cardsGotoOrdering(cards);
                                    player.showCards(cards);
                                    const {
                                        result: { links },
                                    } = await HL.wangzuoboss.chooseButton(['选择其中一张使用之', cards]).set('ai', (button) => get.value(button.link));
                                    if (links && links[0]) {
                                        HL.wangzuoboss.chooseUseTarget(links[0], true, false, 'nodistance');
                                    } else {
                                        player.loseHp();
                                    }
                                }
                            },
                        },
                        // 祛暗
                        //王的回合结束时,你弃置所有敌方角色各一张牌
                        HL_quan: {
                            trigger: {
                                global: ['phaseEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player == HL.wangzuoboss;
                            },
                            async content(event, trigger, player) {
                                for (const npc of player.getEnemies()) {
                                    await player.discardPlayerCard(npc, 'he', true);
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————兴国志士  神  4体力
                        // 图兴
                        // 每回合限一次,你使用锦囊牌时,所有友方角色各摸一张牌
                        HL_tuxing: {
                            trigger: {
                                player: ['useCard'],
                            },
                            forced: true,
                            usable: 1,
                            filter(event, player) {
                                return get.type(event.card) == 'trick';
                            },
                            async content(event, trigger, player) {
                                for (const npc of player.getFriends(true)) {
                                    npc.draw();
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————国之柱石  神  200体力
                        // 镇国
                        // 王对敌方角色造成伤害时,此伤害翻倍
                        HL_zhenguo: {
                            trigger: {
                                global: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.source == HL.wangzuoboss && event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                trigger.num = numberq1(trigger.num) * 2;
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————凡人之愿  群  3体力
                        // 凡愿
                        // 体力减少时,进行一次判定;若不为♥️️,防止之
                        HL_fanyuan: {
                            trigger: {
                                player: ['changeHpBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.num < 0;
                            },
                            async content(event, trigger, player) {
                                const {
                                    result: { suit },
                                } = await player.judge('凡愿', (card) => (card.suit == 'heart' ? -2 : 2));
                                if (suit != 'heart') {
                                    trigger.cancel();
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————丰乐亭侯  神  120体力
                        // 破竹
                        // 每阶段每种牌名限一次,你可以将一张牌当做任意牌使用,摸一张牌
                        HL_pozhu: {
                            init(player) {
                                player.storage.HL_pozhu = [];
                            },
                            enable: ['chooseToUse', 'chooseToRespond'],
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            hiddenCard(player, name) {
                                return player.countCards('hes') && !player.storage.HL_pozhu.includes(name);
                            },
                            filter: (event, player) => player.countCards('hes') && player.qcard().some((q) => !player.storage.HL_pozhu.includes(q[2])),
                            chooseButton: {
                                dialog(event, player) {
                                    return ui.create.dialog('破竹', [player.qcard().filter((q) => !player.storage.HL_pozhu.includes(q[2])), 'vcard']);
                                },
                                check(button) {
                                    const player = _status.event.player;
                                    const num = player.getUseValue(
                                        {
                                            name: button.link[2],
                                            nature: button.link[3],
                                        },
                                        null,
                                        true
                                    );
                                    return number0(num) + 10;
                                },
                                backup(links, player) {
                                    return {
                                        filterCard: true,
                                        selectCard: 1,
                                        position: 'hes',
                                        check: (card) => 12 - get.value(card),
                                        viewAs: {
                                            name: links[0][2],
                                            nature: links[0][3],
                                            suit: links[0][0],
                                            number: links[0][1],
                                        },
                                        async precontent(event, trigger, player) {
                                            player.storage.HL_pozhu.add(event.result.card.name);
                                            player.draw();
                                        },
                                    };
                                },
                                prompt(links, player) {
                                    return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                                },
                            },
                            ai: {
                                fireAttack: true,
                                save: true,
                                respondSha: true,
                                respondShan: true,
                                skillTagFilter(player, tag, arg) {
                                    if (player.countCards('hes')) {
                                        if (tag == 'respondShan') {
                                            return !player.storage.HL_pozhu.includes('shan');
                                        }
                                        if (tag == 'respondSha') {
                                            return !player.storage.HL_pozhu.includes('sha');
                                        }
                                    }
                                    return false;
                                },
                                order: 10,
                                result: {
                                    player(player) {
                                        if (_status.event.dying) {
                                            return get.attitude(player, _status.event.dying);
                                        }
                                        return 1;
                                    },
                                },
                            },
                            group: ['bosshp', 'bossfinish', 'HL_pozhu_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['phaseEnd', 'phaseZhunbeiEnd', 'phaseJudgeEnd', 'phaseDrawEnd', 'phaseUseEnd', 'phaseDiscardEnd', 'phaseJieshuEnd'],
                                    },
                                    silent: true,
                                    async content(event, trigger, player) {
                                        player.storage.HL_pozhu = [];
                                    },
                                },
                            },
                        },
                        // 精械
                        // 准备阶段,你随机使用每种类型强化装备各一张;从牌堆/弃牌堆中随机获得2基本3锦囊
                        HL_jingxie: {
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                let num = 6;
                                while (num-- > 1) {
                                    const card1 = get.cardPile((c) => get.subtype(c) == `equip${num}`, 'field');
                                    if (card1) {
                                        await game.cardsGotoOrdering(card1);
                                        const card2 = get.cardPile((c) => get.subtype(c) == `equip${num}`, 'field');
                                        if (card2) {
                                            await game.cardsGotoOrdering(card2);
                                            const name1 = card1.name;
                                            const name2 = card2.name;
                                            const info2 = lib.card[name2];
                                            const namex = name1 + name2;
                                            lib.card[namex] = deepClone(lib.card[name1]);
                                            const infox = lib.card[namex];
                                            if (info2.skills) {
                                                if (!infox.skills) {
                                                    infox.skills = [];
                                                }
                                                infox.skills.addArray(info2.skills);
                                            }
                                            if (info2.distance) {
                                                if (!infox.distance) {
                                                    infox.distance = {};
                                                }
                                                for (const i in info2.distance) {
                                                    if (infox.distance[i]) {
                                                        infox.distance[i] = infox.distance[i] + info2.distance[i];
                                                    } else {
                                                        infox.distance[i] = info2.distance[i];
                                                    }
                                                }
                                            }
                                            lib.translate[namex] = lib.translate[name1] + lib.translate[name2];
                                            lib.translate[`${namex}_info`] = lib.translate[`${name1}_info`] + lib.translate[`${name2}_info`];
                                            await player.equip(game.createCard(namex));
                                        }
                                    }
                                }
                                const cards = [];
                                let num1 = 3;
                                while (num1-- > 0) {
                                    const card = get.cardPile((c) => get.type(c) == 'basic', 'field');
                                    if (card) {
                                        cards.push(card);
                                    }
                                }
                                let num2 = 2;
                                while (num2-- > 0) {
                                    const card = get.cardPile((c) => get.type(c) == 'trick', 'field');
                                    if (card) {
                                        cards.push(card);
                                    }
                                }
                                player.gain(cards, 'gain2');
                            },
                        },
                        // 谦逊
                        // 其他角色使用的锦囊牌对你无效,你每回合首次受到伤害时,防止之,摸两张牌
                        HL_qianxun: {
                            trigger: {
                                target: ['useCardToPlayer'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player != player && get.type(event.card) == 'trick';
                            },
                            async content(event, trigger, player) {
                                trigger.parent.excluded.add(player);
                            },
                            group: ['HL_qianxun_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['damageBegin4'],
                                    },
                                    usable: 1,
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.cancel();
                                        player.draw(2);
                                    },
                                },
                            },
                        },
                        // 定历
                        // 每名角色准备阶段,你卜算x(x为该角色座次数);免疫王受到的伤害;你退场后,王召唤的士兵生命值翻倍,对敌方角色造成的伤害翻倍
                        HL_dingli: {
                            trigger: {
                                global: ['damageBegin4'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player == HL.wangzuoboss;
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['HL_dingli_1', 'HL_dingli_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['phaseZhunbeiBegin'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.chooseToGuanxing(trigger.player.seatNum);
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['die'],
                                    },
                                    forced: true,
                                    forceDie: true,
                                    filter(event, player) {
                                        return HL.wangzuoboss;
                                    },
                                    async content(event, trigger, player) {
                                        HL.wangzuoboss.addSkill('HL_dingli_3');
                                        for (const i of ['HL_fanren', 'HL_zhushi', 'HL_zhishi', 'HL_zhengchen', 'HL_xiaoyong1', 'HL_xiaoyong2', 'HL_xiaoyong3', 'HL_yuwei']) {
                                            const info = lib.character[i];
                                            info.maxHp = info.maxHp * 2;
                                            info.hp = info.hp * 2;
                                        }
                                    },
                                },
                                3: {
                                    trigger: {
                                        global: ['damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.source?.shibing && event.player.isEnemiesOf(player);
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num = numberq1(trigger.num) * 2;
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————至高烈阳
                        // 天空的化身
                        // 血量:40/40,势力:神
                        // 止————长昼月之息
                        // 你始终拥有1限伤,每当你触发限伤后获得一个<止>,你可以弃置一枚<止>终止一个敌方角色技能的发动
                        HL_A_zhi: {
                            trigger: {
                                player: ['damageBegin4'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            lastDo: true,
                            mark: true,
                            intro: {
                                content: 'mark',
                            },
                            filter(event, player) {
                                return event.num > 1;
                            },
                            async content(event, trigger, player) {
                                player.addMark('HL_A_zhi');
                                trigger.num = 1;
                            },
                            group: ['bosshp', 'bossfinish', 'HL_A_zhi_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['logSkillBegin', 'useSkillBegin'],
                                    },
                                    popup: false,
                                    filter(event, player, name) {
                                        return event.player != player && player.countMark('HL_A_zhi');
                                    },
                                    check(event, player) {
                                        return event.player.isEnemiesOf(player) && !lib.skill.global.includes(event.skill);
                                    },
                                    prompt(event) {
                                        return `终止${get.translation(event.skill)}的发动`;
                                    },
                                    async content(event, trigger, player) {
                                        player.storage.HL_A_zhi--;
                                        const name = trigger.skill;
                                        const info = lib.skill[name];
                                        if (trigger.name == 'logSkillBegin') {
                                            const arr = trigger.parent.next;
                                            for (let i = arr.length - 1; i >= 0; i--) {
                                                if (arr[i].name === name) {
                                                    arr.splice(i, 1);
                                                }
                                            }
                                        } //被终止的触发技也会计入次数
                                        else {
                                            const stat = trigger.player.stat;
                                            const statskill = stat[stat.length - 1].skill;
                                            statskill[name] = numberq0(statskill[name]) + 1;
                                            if (info.sourceSkill) {
                                                statskill[info.sourceSkill] = numberq0(statskill[info.sourceSkill]) + 1;
                                            }
                                            trigger.cancel();
                                        } //被终止的主动技不会计入次数,要手动加一下
                                        game.log(player, `终止${get.translation(name)}的发动`);
                                        if (info.limited || info.juexingji) {
                                            trigger.player.awakenSkill(name);
                                        }
                                    },
                                },
                            },
                        },
                        // 落————机缘月之光
                        // 当有角色不因击杀你而获得胜利时,取消之并斩杀该角色
                        // 体力上限或体力值低于3的敌方角色,所有技能失效
                        HL_A_luo: {
                            init(player) {
                                if (player.playerid) {
                                    const oover = game.over;
                                    game.over = async function (result, bool) {
                                        if (player.hp > 0 && player.getEnemies().length && !HL.fangbaozhan1) {
                                            const playerx = _status.event.player;
                                            let players = player.getEnemies();
                                            if (playerx && playerx != player) {
                                                players = [playerx];
                                            }
                                            if (!_status.auto) {
                                                ui.click.auto();
                                            } //托管
                                            HL.fangbaozhan1 = true;
                                            for (const npc of players) {
                                                player.line(npc);
                                                game.log(player, '惩罚直接结束游戏的角色', npc);
                                                const next = game.createEvent('diex', false);
                                                next.source = player;
                                                next.player = npc;
                                                next._triggered = null;
                                                await next.setContent(lib.element.content.die);
                                            } //即死
                                            HL.fangbaozhan1 = false;
                                        }
                                        if (player.hp > 0 && player.getEnemies().length) {
                                            return;
                                        }
                                        return oover(result, bool);
                                    };
                                } //挑战模式适配
                            },
                            trigger: {
                                global: ['gameStart', 'phaseBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (!HL.HL_A_luo) {
                                    HL.HL_A_luo = [];
                                }
                                HL.HL_A_luo.add(player);
                                for (const npc of player.getEnemies()) {
                                    if (!npc.storage.skill_blocker) {
                                        npc.storage.skill_blocker = [];
                                    }
                                    npc.storage.skill_blocker.add('HL_A_luo');
                                }
                            },
                            skillBlocker(skill, player) {
                                if (HL.HL_A_luo && !HL.HL_A_luo.includes(player) && (player.hp < 3 || player.maxHp < 3)) {
                                    const info = lib.skill[skill];
                                    return info && !info.kangxing;
                                }
                            },
                        },
                        // 击————三千里之火
                        // 游戏开始时,将场地天气切换为<烈阳>.任意火属性伤害被造成时,将你场地天气切换为<烈阳>
                        HL_A_ji: {
                            _priority: 300,
                            trigger: {
                                global: ['gameStart', 'damageBefore'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                if (name == 'damageBefore') {
                                    return event.nature == 'fire';
                                }
                                return true;
                            },
                            async content(event, trigger, player) {
                                HL.tianqi = ['HL_lieyang'];
                                HL.temperature = 10;
                                ui.background.style.backgroundImage = `url(extension/火灵月影/image/HL_lieyang.jpg)`;
                                if (!HL.tqjs) {
                                    HL.tqjs = ui.create.div('.tqjs', document.body);
                                }
                                HL.tqjs.innerHTML = "<b style='color:rgb(233, 108, 24); font-size: 25px;'>烈阳</b>";
                                HL.tqjs.onclick = function () {
                                    const div = ui.create.div('.HL_dialog', document.body);
                                    div.innerHTML = '<b style="color:rgb(223, 175, 19);">此天气下,火属性伤害翻倍<br>每次火属性伤害会增加环境温度<br>任意出牌阶段开始时,根据当前温度点燃其随机数量手牌称为<燃><br><燃>造成的伤害视为火属性,被<燃>指定的目标根据温度受到随机火属性伤害<br>任意回合结束后,若当前角色牌中有<燃>,焚毁这些牌并对其造成等量火属性伤害</b>';
                                    setTimeout(function () {
                                        div.remove();
                                    }, 2000);
                                };
                            },
                        },
                        // 烈阳
                        // 此天气下,火属性伤害翻倍
                        // 每次火属性伤害会增加环境温度
                        // 任意出牌阶段开始时,根据当前温度点燃其随机数量手牌称为<燃>
                        // <燃>造成的伤害视为火属性,被<燃>指定的目标根据温度受到随机火属性伤害
                        // 任意回合结束后,若当前角色牌中有<燃>,焚毁这些牌并对其造成等量火属性伤害
                        _HL_lieyang: {
                            _priority: 100,
                            trigger: {
                                player: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return HL.tianqi.includes('HL_lieyang') && (event.cards?.some((q) => q.fire) || ['fire'].includes(event.nature));
                            },
                            async content(event, trigger, player) {
                                if (trigger.cards?.some((q) => q.fire)) {
                                    trigger.nature = 'fire';
                                }
                                if (trigger.nature == 'fire') {
                                    trigger.num *= 2;
                                    HL.temperature += numberq0(trigger.num);
                                }
                            },
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['phaseUseBegin'],
                                    },
                                    forced: true,
                                    filter(event, player, name) {
                                        return HL.tianqi.includes('HL_lieyang') && player.countCards('h') && HL.temperature > 0;
                                    },
                                    async content(event, trigger, player) {
                                        const num = Math.ceil((HL.temperature / 100) * player.countCards('h'));
                                        const cards = player.getCards('h').randomGets(num);
                                        for (const card of cards) {
                                            card.fire = true;
                                            card.HL_BG('qflame');
                                        }
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['useCardToPlayer'],
                                    },
                                    forced: true,
                                    filter(event, player, name) {
                                        return HL.tianqi.includes('HL_lieyang') && event.cards?.some((q) => q.fire) && HL.temperature > 0;
                                    },
                                    async content(event, trigger, player) {
                                        if (Math.random() < HL.temperature / 100) {
                                            trigger.target.damage('fire', 'nosource');
                                        }
                                    },
                                },
                                3: {
                                    trigger: {
                                        player: ['phaseUseEnd'],
                                    },
                                    forced: true,
                                    filter(event, player, name) {
                                        return HL.tianqi.includes('HL_lieyang') && player.countCards('he', (c) => c.fire);
                                    },
                                    async content(event, trigger, player) {
                                        const cards = player.getCards('he', (c) => c.fire);
                                        for (const card of cards) {
                                            card.selfDestroy();
                                            player.damage('fire', 'nosource');
                                        }
                                    },
                                },
                            },
                        },
                        // 烜————若垂天之云
                        // 每轮开始时/准备阶段,你视为对所有敌方角色使用一张【火烧连营】
                        HL_A_heng: {
                            trigger: {
                                global: ['roundStart'],
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (Math.random() > 0.7) {
                                    await game.HL_mp4(event.name);
                                }
                                player.useCard({ name: 'huoshaolianying' }, player.getEnemies(), false);
                            },
                        },
                        // 怒————焚晨昏日星
                        // 蓄力技(0/9),①每受到/造成1点火焰伤害后获得1点蓄力值.
                        // ②当蓄力值达到上限时,消耗所有蓄力值,令所有敌方角色受到1～2点火焰伤害并弃置等量手牌
                        HL_A_nu: {
                            chargeSkill: 9,
                            trigger: {
                                player: ['damageEnd'],
                                source: ['damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.nature == 'fire';
                            },
                            async content(event, trigger, player) {
                                await player.addCharge(trigger.num);
                                if (player.countCharge() > 8) {
                                    if (Math.random() > 0.7) {
                                        await game.HL_mp4(event.name);
                                    }
                                    player.removeCharge(9);
                                    for (const npc of player.getEnemies()) {
                                        const num = [1, 2].randomGet();
                                        await npc.damage('fire', num);
                                        await npc.randomDiscard('h', num);
                                    }
                                }
                            },
                        },
                        // 抟————九万里之炎
                        // 觉醒技,体力值低于一半时,你将武将牌替换为【至怒狂雷】
                        HL_A_zhuan: {
                            trigger: {
                                player: ['changeHp', 'damageBefore'],
                            },
                            _priority: 400,
                            forced: true,
                            limited: true,
                            filter(event, player) {
                                return player.hp < player.maxHp / 2 && !player.storage.HL_A_zhuan;
                            },
                            async content(event, trigger, player) {
                                player.awakenSkill('HL_A_zhuan');
                                await game.HL_mp4(event.name);
                                player.qreinit('HL_zhinukuanglei');
                                const remove = ['HL_A_ji', 'HL_A_heng', 'HL_A_nu', 'HL_A_zhuan'];
                                game.skangxing(player, ['HL_A_ming', 'HL_A_ting', 'HL_A_fen', 'HL_A_ce'], remove);
                                player.removeSkill(remove);
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————至怒狂雷
                        // 天空的化身
                        // 鸣————三千里之雷
                        // 任意<雷>/<水>属性伤害被造成时,将场地天气切换为<雷电>/<暴雨>.你登场时,为牌堆中随机加入二十分之一的<水弹>
                        HL_A_ming: {
                            init(player) {
                                const pilenode = ui.cardPile.childNodes;
                                let num = Math.ceil(pilenode.length / 20);
                                while (num-- > 0) {
                                    const card = game.createCard('shuidan');
                                    ui.cardPile.insertBefore(card, pilenode[get.rand(0, pilenode.length - 1)]);
                                }
                            },
                            _priority: 300,
                            trigger: {
                                global: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return ['water', 'thunder'].includes(event.nature);
                            },
                            async content(event, trigger, player) {
                                if (!HL.tqjs) {
                                    HL.tqjs = ui.create.div('.tqjs', document.body);
                                }
                                if (trigger.nature == 'thunder') {
                                    HL.tianqi = ['HL_leidian'];
                                    ui.background.style.backgroundImage = `url(extension/火灵月影/image/HL_leidian.jpg)`;
                                    HL.tqjs.innerHTML = "<b style='color:rgb(171, 22, 230); font-size: 25px;'>雷电</b>";
                                    HL.tqjs.onclick = function () {
                                        const div = ui.create.div('.HL_dialog', document.body);
                                        div.innerHTML = '<b style="color:rgb(223, 175, 19);">此天气下,雷属性伤害翻倍<br>所有黑桃牌均视为雷属性<br>任意牌被使用或打出时,当前角色进行一次闪电判定</b>';
                                        setTimeout(function () {
                                            div.remove();
                                        }, 2000);
                                    };
                                } else {
                                    HL.tianqi = ['HL_baoyu'];
                                    ui.background.style.backgroundImage = `url(extension/火灵月影/image/HL_baoyu.jpg)`;
                                    HL.tqjs.innerHTML = "<b style='color:rgb(17, 140, 223); font-size: 25px;'>暴雨</b>";
                                    HL.tqjs.onclick = function () {
                                        const div = ui.create.div('.HL_dialog', document.body);
                                        div.innerHTML = '<b style="color:rgb(223, 175, 19);">此天气下,水属性伤害翻倍<br>任意回合开始时,将场上所有装备牌变化为<水弹><br>每回合至多使用5-<水弹>数张牌</b>';
                                        setTimeout(function () {
                                            div.remove();
                                        }, 2000);
                                    };
                                }
                            },
                        },
                        // 雷电
                        // 此天气下,雷属性伤害翻倍
                        // 所有黑桃牌均视为雷属性
                        // 任意牌被使用或打出时,当前角色进行一次闪电判定
                        _HL_leidian: {
                            _priority: 100,
                            trigger: {
                                player: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return HL.tianqi.includes('HL_leidian') && (event.card?.suit == 'spade' || ['thunder'].includes(event.nature));
                            },
                            async content(event, trigger, player) {
                                if (trigger.card?.suit == 'spade') {
                                    trigger.nature = 'thunder';
                                }
                                if (trigger.nature == 'thunder') {
                                    trigger.num *= 2;
                                }
                            },
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['useCard', 'respond'],
                                    },
                                    forced: true,
                                    filter(event, player, name) {
                                        return HL.tianqi.includes('HL_leidian');
                                    },
                                    async content(event, trigger, player) {
                                        player.executeDelayCardEffect('shandian');
                                    },
                                },
                            },
                        },
                        // 暴雨
                        // 此天气下,水属性伤害翻倍
                        // 任意回合开始时,将场上所有装备牌变化为<水弹>
                        // 每回合至多使用5-<水弹>数张牌
                        _HL_baoyu: {
                            mod: {
                                cardEnabled2(card, player) {
                                    if (HL.tianqi.includes('HL_baoyu')) {
                                        const his = player.actionHistory;
                                        const evt = his[his.length - 1];
                                        const num = evt.useCard.length;
                                        const cards = player.getCards('he', { name: 'shuidan' });
                                        if (num + cards.length > 5) {
                                            return false;
                                        }
                                    }
                                },
                            },
                            _priority: 100,
                            trigger: {
                                player: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return HL.tianqi.includes('HL_baoyu') && ['water'].includes(event.nature);
                            },
                            async content(event, trigger, player) {
                                trigger.num *= 2;
                            },
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['phaseBegin'],
                                    },
                                    forced: true,
                                    filter(event, player, name) {
                                        return HL.tianqi.includes('HL_baoyu') && game.players.some((q) => q.countCards('he', { type: 'equip' }));
                                    },
                                    async content(event, trigger, player) {
                                        for (const npc of game.players) {
                                            npc.removeEquipTrigger();
                                            const cards = npc.getCards('he', { type: 'equip' });
                                            for (const card of cards) {
                                                card.init([card.suit, card.number, 'shuidan', card.nature]);
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        // 水弹
                        // 回合限一次,你可以将一枚<水弹>转移给其他角色,不因此而失去<水弹>时,受到一点水属性伤害
                        g_shuidan: {
                            trigger: {
                                player: ['loseEnd'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return event.parent.name != 'useCard' && event.cards.some((q) => q.name == 'shuidan');
                            },
                            async content(event, trigger, player) {
                                for (const card of trigger.cards) {
                                    if (card.name == 'shuidan') {
                                        player.damage('water', 'nosource');
                                    }
                                }
                            },
                        },
                        // 霆————如海摇山倾
                        // 每轮开始时/准备阶段,你视为对所有敌方角色使用一张【水淹七军】
                        HL_A_ting: {
                            trigger: {
                                global: ['roundStart'],
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (Math.random() > 0.7) {
                                    await game.HL_mp4(event.name);
                                }
                                player.useCard({ name: 'shuiyanqijunx' }, player.getEnemies(), false);
                            },
                        },
                        // 愤————破昼夜长空
                        // 蓄力技(0/9),①每受到/造成1点雷电伤害后获得1点蓄力值.
                        // ②当蓄力值达到上限时,消耗所有蓄力值,令所有敌方角色受到1～2点雷电伤害并弃置等量手牌
                        HL_A_fen: {
                            chargeSkill: 9,
                            trigger: {
                                player: ['damageEnd'],
                                source: ['damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.nature == 'thunder';
                            },
                            async content(event, trigger, player) {
                                await player.addCharge(trigger.num);
                                if (player.countCharge() > 8) {
                                    if (Math.random() > 0.7) {
                                        await game.HL_mp4(event.name);
                                    }
                                    player.removeCharge(9);
                                    for (const npc of player.getEnemies()) {
                                        const num = [1, 2].randomGet();
                                        await npc.damage('thunder', num);
                                        await npc.randomDiscard('h', num);
                                    }
                                }
                            },
                        },
                        // 策————九万里之电
                        // 觉醒技,当你体力值不大于0时,将武将牌更换为【绝灭者】,并进行一个额外回合
                        HL_A_ce: {
                            trigger: {
                                player: ['changeHp', 'damageBefore'],
                            },
                            forced: true,
                            juexingji: true,
                            filter(event, player) {
                                return player.hp < 1 && !player.storage.HL_A_ce;
                            },
                            async content(event, trigger, player) {
                                player.awakenSkill('HL_A_ce');
                                await game.HL_mp4(event.name);
                                player.qreinit('HL_juemiezhe');
                                const remove = ['HL_A_ming', 'HL_A_ting', 'HL_A_fen', 'HL_A_ce'];
                                game.skangxing(player, ['HL_zhianchaoxi', 'HL_zhangbujimoyan', 'HL_jinhuisiji'], remove);
                                player.removeSkill(remove);
                                const evt = _status.event.getParent('phase', true);
                                if (evt) {
                                    evt.finish();
                                }
                                player.phase('nodelay');
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————绝灭者
                        // 阳雷的业果————晨昏之眼
                        // 至暗潮汐
                        // ①游戏开始时,全场角色获得技能<虹彩>
                        // ②每轮开始时或准备阶段,你令所有敌方角色选择一项:1,失去2点体力值;2,减少1点体力上限
                        // ③任意敌方角色体力上限与体力值均为1时斩杀该角色
                        HL_zhianchaoxi: {
                            _priority: 9,
                            trigger: {
                                global: ['roundStart'],
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                for (const npc of player.getEnemies()) {
                                    const choiceList = ['失去2点体力值', '减少1点体力上限'];
                                    const {
                                        result: { index },
                                    } = await npc
                                        .chooseControl()
                                        .set('prompt', '选择一项')
                                        .set('choiceList', choiceList)
                                        .set('ai', function (event, player) {
                                            if (npc.maxHp > npc.hp) {
                                                return '减少1点体力上限';
                                            }
                                            return '失去2点体力值';
                                        });
                                    switch (index) {
                                        case 0:
                                            await npc.loseHp(2);
                                            break;
                                        case 1:
                                            await npc.loseMaxHp();
                                            break;
                                    }
                                }
                            },
                            group: ['HL_zhianchaoxi_1'],
                            global: ['HL_hongcai'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['changeHp', 'loseMaxHpEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.maxHp < 2 && event.player.hp < 2 && event.player.isEnemiesOf(player);
                                    },
                                    async content(event, trigger, player) {
                                        trigger.player.CS();
                                        player.line(trigger.player);
                                        const next = game.createEvent('diex', false);
                                        next.source = player;
                                        next.player = trigger.player;
                                        next._triggered = null;
                                        await next.setContent(lib.element.content.die);
                                    },
                                },
                            },
                        },
                        // 虹彩
                        // 出牌阶段限一次,你可以弃置两张牌复原武将牌,增加3点体力上限,回复3点体力值,摸七张牌,本回合造成的伤害翻倍,获得所有场地天气效果
                        HL_hongcai: {
                            enable: 'phaseUse',
                            usable: 1,
                            filterCard: true,
                            selectCard: 2,
                            position: 'he',
                            async content(event, trigger, player) {
                                player.classList.remove('linked', 'turnedover');
                                player.gainMaxHp(3);
                                player.recover(3);
                                player.draw(7);
                                player.addTempSkill('HL_hongcai_1');
                                HL.tianqi = ['HL_lieyang', 'HL_baoyu', 'HL_leidian'];
                                if (!HL.tqjs) {
                                    HL.tqjs = ui.create.div('.tqjs', document.body);
                                }
                                HL.tqjs.innerHTML = "<b style='color:rgb(233, 108, 24); font-size: 25px;'>烈阳</b><br><b style='color:rgb(171, 22, 230); font-size: 25px;'>雷电</b><br><b style='color:rgb(17, 140, 223); font-size: 25px;'>暴雨</b>";
                                HL.tqjs.onclick = function () {
                                    const div = ui.create.div('.HL_dialog', document.body);
                                    div.innerHTML = '<b style="color:rgb(223, 175, 19);">三种天气,自求多福吧</b>';
                                    setTimeout(function () {
                                        div.remove();
                                    }, 2000);
                                };
                            },
                            ai: {
                                order: 10,
                                result: {
                                    player: 10,
                                },
                            },
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['damageBefore'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.num *= 2;
                                    },
                                },
                            },
                        },
                        // 张怖寂魔眼
                        // 每轮开始时或准备阶段,视为你对所有敌方角色使用一张【水淹七军】和【火烧连营】
                        HL_zhangbujimoyan: {
                            _priority: 8,
                            trigger: {
                                global: ['roundStart'],
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                if (Math.random() > 0.7) {
                                    await game.HL_mp4(event.name);
                                }
                                await player.useCard({ name: 'shuiyanqijunx' }, player.getEnemies(), false);
                                player.useCard({ name: 'huoshaolianying' }, player.getEnemies(), false);
                            },
                        },
                        // 烬灰死寂,诸神屠灭
                        // 蓄力技(0/9),每受到/造成1点火焰或雷电伤害后获得1点蓄力值.
                        // 当蓄力值达到上限时,消耗所有蓄力值对所有敌方角色造成1点火焰伤害,1点雷电伤害,受伤角色各失去1点体力值,减少1点体力上限并弃置已损失体力值数牌
                        HL_jinhuisiji: {
                            chargeSkill: 18,
                            trigger: {
                                player: ['damageEnd'],
                                source: ['damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return ['fire', 'thunder'].includes(event.nature);
                            },
                            async content(event, trigger, player) {
                                await player.addCharge(trigger.num);
                                if (player.countCharge() > 17) {
                                    if (Math.random() > 0.7) {
                                        await game.HL_mp4(event.name);
                                    }
                                    player.removeCharge(18);
                                    for (const npc of player.getEnemies()) {
                                        await npc.damage('fire');
                                        await npc.damage('thunder');
                                        await npc.loseHp();
                                        await npc.loseMaxHp();
                                        await npc.randomDiscard('h', npc.getDamagedHp());
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————邵
                        HL_kangkaijiang: {
                            trigger: {
                                player: ['useCardToPlayered', 'respond', 'useCard'],
                                target: 'useCardToTargeted',
                            },
                            filter(event, player) {
                                if (['respond', 'useCard'].includes(event.name)) return ['shan'].includes(event.card.name);
                                if (!(event.card.name == 'juedou' || event.card.name == 'sha')) return false;
                                return player == event.target || event.parent.triggeredTargets3.length == 1;
                            },
                            forced: true,
                            content() {
                                var card = [];
                                var card1 = get.cardPile(function (card) {
                                    return card.name == 'sha';
                                });
                                var card2 = get.cardPile(function (card) {
                                    return card.name == 'shan';
                                });
                                if (card1) card.add(card1);
                                if (card2) card.add(card2);
                                if (card.length) player.gain(card, 'gain2');
                            },
                            ai: {
                                effect: {
                                    target(card, player, target) {
                                        if (card.name == 'sha') return [1, 0.6];
                                    },
                                    player(card, player, target) {
                                        if (card.name == 'sha') return [1, 1];
                                    },
                                },
                            },
                        },
                        HL_yelongliezhan: {
                            trigger: {
                                source: 'damageSource',
                            },
                            filter(event, player) {
                                return event.nature == 'fire';
                            },
                            forced: true,
                            content() {
                                trigger.player.addMark('_HL_shaoshang');
                                player.chooseToDiscard(true, 'he');
                            },
                            mod: {
                                cardnature(card, player) {
                                    if (card.name == 'sha' && get.color(card) == 'red') return 'fire';
                                },
                                cardUsable(card, player) {
                                    if (card.name == 'sha' && get.color(card) == 'red') return Infinity;
                                },
                            },
                        },
                        HL_pulaomingzhong: {
                            trigger: {
                                global: 'discardEnd',
                                player: 'loseHpBegin',
                            },
                            forced: true,
                            content() {
                                if (trigger.name == 'loseHp') trigger.cancel();
                                else {
                                    if (trigger.player == player) {
                                        var players = player.getEnemies().sortBySeat();
                                        for (const i of players) {
                                            i.chooseToDiscard(true, 'he');
                                        }
                                    }
                                    trigger.player.addMark('_HL_shaoshang');
                                }
                            },
                            group: 'HL_pulaomingzhong_discard',
                            subSkill: {
                                discard: {
                                    trigger: {
                                        player: ['loseEnd'],
                                        global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        if (event.getl && !event.getl(player)) return false;
                                        return player.countCards('h') > 20;
                                    },
                                    content() {
                                        player.chooseToDiscard('h', true, player.countCards('h') - 20);
                                    },
                                },
                            },
                        },
                        HL_gongfubishui: {
                            trigger: {
                                player: 'damageBegin',
                            },
                            filter(event, player) {
                                return ['fire', 'thunder', undefined].includes(event.nature);
                            },
                            forced: true,
                            content() {
                                if (trigger.nature == 'fire') trigger.cancel();
                                else {
                                    trigger.num--;
                                    if (player.hp == player.maxHp) player.changeHujia();
                                    else player.recover();
                                }
                            },
                            ai: {
                                effect: {
                                    target(card, player, target) {
                                        if (get.tag(card, 'fireDamage')) return [0, 2];
                                        if (get.tag(card, 'thunderDamage')) return [0, 1.5];
                                    },
                                },
                            },
                        },
                        _HL_shaoshang: {
                            trigger: {
                                player: ['phaseJieshuEnd'],
                            },
                            filter(event, player) {
                                return player.countMark('_HL_shaoshang') > 0;
                            },
                            async content(event, trigger, player) {
                                player.damage(player.countMark('_HL_shaoshang'), 'fire', 'nosource');
                                player.removeMark('_HL_shaoshang', Math.ceil(player.countMark('_HL_shaoshang') / 2));
                            },
                            forced: true,
                            charlotte: true,
                            marktext: '烧伤',
                            intro: {
                                name: '烧伤',
                                content(storage, player, skill) {
                                    return '<li>你的手牌上限-' + storage + ';<br><li>结束阶段,你受到' + storage + '点无来源的火属性伤害并减少一半此标记(向上取整)';
                                },
                            },
                            mod: {
                                maxHandcard(player, num) {
                                    return num - player.countMark('_HL_shaoshang');
                                },
                            },
                        },
                        HL_shaoEGO: {
                            trigger: {
                                player: ['useCard', 'respond'],
                                source: ['damageEnd'],
                            },
                            filter(event, player) {
                                return player.countMark('HL_shaoEGO') < 15;
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            async content(event, trigger, player) {
                                if (trigger.name == 'damage') {
                                    player.addMark('HL_shaoEGO', 3);
                                } else {
                                    player.addMark('HL_shaoEGO', 1);
                                }
                            },
                            marktext: '情感',
                            intro: {
                                name: '情感',
                                content: 'mark',
                            },
                            mod: {
                                cardUsable(card, player, num) {
                                    var n = Math.floor(player.countMark('HL_shaoEGO') / 3);
                                    if (card.name == 'sha') return num + n;
                                },
                            },
                            group: ['bosshp', 'bossfinish', 'HL_shaoEGO_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['phaseBegin', 'phaseEnd'],
                                    },
                                    forced: true,
                                    filter: (event, player) => player.name == 'HL_shao' && player.storage.HL_shaoEGO > 12 && ['HL_jiaotu', 'HL_bian', 'HL_liwen', 'HL_yazi', 'HL_suoni', 'HL_taotie', 'HL_bili'].some((q) => !player.hasSkill(q)),
                                    async content(event, trigger, player) {
                                        //QQQ
                                        for (const i of ['HL_jiaotu', 'HL_bian', 'HL_liwen', 'HL_yazi', 'HL_suoni', 'HL_taotie', 'HL_bili']) {
                                            player.addSkill(i);
                                            player.node.avatar.style.backgroundImage = `url(extension/火灵月影/image/HL_shao_EGO.jpg)`;
                                            ui.background.style.backgroundImage = `url(extension/火灵月影/image/shao_EGO.jpg)`;
                                            ui.backgroundMusic.src = `extension/火灵月影/audio/shao_EGO.mp3`;
                                            ui.backgroundMusic.loop = true;
                                        }
                                    },
                                },
                            },
                        },
                        HL_jiaotu: {
                            trigger: {
                                target: ['useCardToTarget'],
                            },
                            forced: true,
                            filter: (event, player) => event.player.isEnemiesOf(player),
                            async content(event, trigger, player) {
                                //QQQ
                                if (trigger.card.number && trigger.cards && trigger.cards[0]) {
                                    const { result } = await player.chooseCard('与其使用的牌拼点', 'h');
                                    if (result.cards && result.cards[0]) {
                                        game.cardsGotoOrdering(result.cards);
                                        await player.$compare(result.cards[0], trigger.player, trigger.cards[0]);
                                        game.log(player, '的拼点牌为', result.cards[0]);
                                        game.log(trigger.player, '的拼点牌为', trigger.cards[0]);
                                        if (result.cards[0].number > trigger.cards[0].number) {
                                            trigger.parent.all_excluded = true;
                                            trigger.player.addMark('_HL_shaoshang', 3);
                                        }
                                    }
                                } else {
                                    trigger.parent.all_excluded = true;
                                }
                            },
                        },
                        HL_bian: {
                            trigger: {
                                global: ['phaseBegin'],
                            },
                            forced: true,
                            filter: (event, player) => event.player.isEnemiesOf(player),
                            async content(event, trigger, player) {
                                //QQQ
                                for (const i of game.players.filter((q) => q.isEnemiesOf(player) && q.countMark('_HL_shaoshang'))) {
                                    const num = i.countMark('_HL_shaoshang');
                                    i.damage(num, 'fire');
                                    const num1 = num + player.hp - player.maxHp;
                                    if (num1 > 0) {
                                        player.recover(num - num1);
                                        player.changeHujia(num1);
                                    } else {
                                        player.recover(num);
                                    }
                                }
                            },
                        },
                        HL_liwen: {
                            trigger: {
                                target: ['useCardToTarget'],
                            },
                            forced: true,
                            filter: (event, player) => event.player.isEnemiesOf(player),
                            async content(event, trigger, player) {
                                //QQQ
                                const { result } = await player.judge('螭吻吞脊', (card) => (get.color(card) == 'black' ? -2 : 2));
                                if (result && result.card) {
                                    if (get.color(result.card) == 'black') {
                                        player.loseHp();
                                    } else {
                                        trigger.player.loseHp();
                                    }
                                }
                            },
                        },
                        HL_yazi: {
                            trigger: {
                                player: ['useCardToTarget'],
                            },
                            filter: (event, player) => event.target.isEnemiesOf(player),
                            forced: true,
                            async content(event, trigger, player) {
                                const { result } = await player.judge('睚眦雪恨', (card) => (card.number == player.maxHp ? 0 : 2));
                                if (result && result.card) {
                                    if (result.card.number != player.maxHp) {
                                        trigger.target.addMark('_HL_shaoshang', 2);
                                    }
                                }
                            },
                        },
                        HL_suoni: {
                            trigger: {
                                player: ['phaseBegin', 'phaseEnd'],
                            },
                            forced: true,
                            filter: (event, player) => game.players.some((q) => q.countMark('_HL_shaoshang')),
                            async content(event, trigger, player) {
                                //QQQ
                                var num = 0;
                                for (const i of game.players) {
                                    num += i.countMark('_HL_shaoshang');
                                }
                                const num1 = num * player.countMark('HL_shaoEGO');
                                for (const i of game.players) {
                                    if (i.countMark('_HL_shaoshang') && i.isEnemiesOf(player)) {
                                        var num2 = 6;
                                        while (num2-- > 0) {
                                            await i.damage(num1, 'fire');
                                        }
                                    }
                                }
                            },
                        },
                        HL_taotie: {
                            trigger: {
                                player: ['damageBegin4'],
                            },
                            forced: true,
                            filter(event, player) {
                                var num = 0;
                                for (const i of game.players) {
                                    num += i.countMark('_HL_shaoshang');
                                }
                                return event.num > 0 && player.countCards('he') && num > 0;
                            },
                            async content(event, trigger, player) {
                                const { result } = await player.chooseToDiscard(1, 'he', true);
                                if (result.cards && result.cards[0]) {
                                    var num = 0;
                                    for (const i of game.players) {
                                        num += i.countMark('_HL_shaoshang');
                                    }
                                    trigger.num -= num;
                                    if (trigger.num < 0) {
                                        trigger.cancel();
                                    }
                                }
                            },
                            group: ['HL_taotie_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['loseHpBegin'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.gainMaxHp();
                                        trigger.cancel();
                                    },
                                },
                            },
                        },
                        HL_bili: {
                            trigger: {
                                source: ['damageBefore'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                var num = 0;
                                for (const i of game.players) {
                                    num += i.countMark('_HL_shaoshang');
                                }
                                trigger.num += num;
                            },
                            group: ['HL_bili_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: 'compare',
                                        target: 'compare',
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        var num = 0;
                                        for (const i of game.players) {
                                            num += i.countMark('_HL_shaoshang');
                                        }
                                        if (player == trigger.player) {
                                            trigger.num1 += num;
                                        } else {
                                            trigger.num2 += num;
                                        }
                                    },
                                },
                            },
                        },
                        //星星之火:当你失去最后的手牌时,将你的手牌补充为四
                        HL_xingxingzhihuo: {
                            trigger: {
                                player: ['loseEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return !player.countCards('h');
                            },
                            async content(event, trigger, player) {
                                player.draw(4);
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————李白  唐  3/6/9/12体力
                        HL_libai_bossjieshao: {},
                        // 天上白玉京
                        // 你只能受到实体牌的伤害
                        HL_baiyujing: {
                            trigger: {
                                player: ['damageBefore'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            filter(event, player) {
                                if (event.cards?.length && event.card && event.cards[0].name == event.card.name) {
                                    return false;
                                }
                                return true;
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['bosshp', 'bossfinish'],
                        },
                        // 赵客缦胡缨
                        // 登场时,弃置敌方角色所有装备牌,并令其依次使用一张随机武器牌,其无法以除此之外的方式失去武器牌
                        HL_manhuying: {
                            trigger: {
                                global: ['roundStart'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.roundNumber == 1;
                            },
                            async content(event, trigger, player) {
                                for (const npc of player.getEnemies()) {
                                    await npc.discard(npc.getCards('he', { type: 'equip' }));
                                    const card = get.cardPile((c) => get.subtype(c) == `equip1`, 'field');
                                    await npc.equip(card);
                                }
                            },
                            group: ['HL_manhuying_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['loseBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.cards?.some((c) => get.subtype(c) == `equip1` && get.position(c) == 'e') && event.player.isEnemiesOf(player) && !event.getParent('HL_manhuying', true);
                                    },
                                    async content(event, trigger, player) {
                                        trigger.cards = trigger.cards.filter((c) => get.subtype(c) != `equip1` || get.position(c) != 'e');
                                    },
                                },
                            },
                        },
                        // 十步杀一人
                        // 你每使用十张牌后,击杀一名敌方角色
                        HL_shibusha: {
                            init(player) {
                                player.storage.HL_shibusha = 0;
                            },
                            trigger: {
                                player: ['useCardEnd'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `再使用${10 - storage}张牌击杀一名敌方角色`;
                                },
                            },
                            async content(event, trigger, player) {
                                player.storage.HL_shibusha++;
                                if (player.storage.HL_shibusha > 9) {
                                    player.storage.HL_shibusha = 0;
                                    const npc = player.getEnemies().randomGet();
                                    if (npc) {
                                        player.line(npc);
                                        const next = game.createEvent('diex', false);
                                        next.source = player;
                                        next.player = npc;
                                        next._triggered = null;
                                        await next.setContent(lib.element.content.die);
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————一阶段
                        // 无人知所去
                        // 全场每累计使用三张牌后,你进入无敌状态直到下个角色准备阶段
                        HL_wurenzhi: {
                            init(player) {
                                player.storage.HL_wurenzhi = 0;
                            },
                            trigger: {
                                global: ['useCardEnd'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `再使用${3 - storage}张牌进入无敌`;
                                },
                            },
                            async content(event, trigger, player) {
                                player.storage.HL_wurenzhi++;
                                if (player.storage.HL_wurenzhi > 2) {
                                    player.storage.HL_wurenzhi = 0;
                                    player.storage.HL_wurenzhi_1 = true;
                                    player.when({ global: 'phaseZhunbeiBegin' }).then(() => (player.storage.HL_wurenzhi_1 = false));
                                }
                            },
                            group: ['HL_wurenzhi_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['changeHpBefore', 'loseBefore'],
                                    },
                                    forced: true,
                                    mark: true,
                                    intro: {
                                        content(storage) {
                                            if (storage) {
                                                return `无敌`;
                                            }
                                            return `没有无敌`;
                                        },
                                    },
                                    filter(event, player, name) {
                                        if (player.storage.HL_wurenzhi_1) {
                                            if (name == 'loseBefore') {
                                                return !['useCard', 'respond', 'equip'].includes(event.parent.name);
                                            }
                                            return event.num < 0;
                                        }
                                    },
                                    async content(event, trigger, player) {
                                        trigger.cancel();
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————二阶段
                        // 人生得意须尽欢
                        // 任意角色进入濒死后,你结束当前回合
                        // 任意【酒】被使用后,你下一张伤害牌伤害+1
                        // 任意伤害牌被使用后,你摸等同于此牌伤害值张牌
                        HL_xujinhuan: {
                            init(player) {
                                player.storage.HL_xujinhuan = 0;
                            },
                            trigger: {
                                global: ['useCardEnd'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `下一张伤害牌伤害+${storage}`;
                                },
                            },
                            filter(event, player) {
                                return get.tag(event.card, 'damage') || event.card.name == 'jiu';
                            },
                            async content(event, trigger, player) {
                                if (trigger.card.name == 'jiu') {
                                    player.storage.HL_xujinhuan++;
                                } else {
                                    const his = trigger.player.actionHistory;
                                    const evt = his[his.length - 1];
                                    for (const i of evt.sourceDamage) {
                                        if (i.card == trigger.card) {
                                            player.draw(i.num);
                                        }
                                    }
                                }
                            },
                            group: ['HL_xujinhuan_1', 'HL_xujinhuan_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['useCard'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return get.tag(event.card, 'damage') && player.storage.HL_xujinhuan > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.baseDamage += player.storage.HL_xujinhuan;
                                        player.storage.HL_xujinhuan = 0;
                                    },
                                },
                                2: {
                                    trigger: {
                                        global: ['dyingBefore'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        const evt = _status.event.getParent('phase', true);
                                        if (evt) {
                                            evt.finish();
                                        }
                                    },
                                },
                            },
                        },
                        // 莫使金樽空对月
                        // 所有角色黑/红色手牌视作【酒】/【杀】
                        HL_kongduiyue: {
                            global: ['HL_kongduiyue_1'],
                            subSkill: {
                                1: {
                                    mod: {
                                        cardname(card, player, name) {
                                            if (['heart', 'diamond'].includes(card.suit)) {
                                                return 'sha';
                                            }
                                            if (['spade', 'club'].includes(card.suit)) {
                                                return 'jiu';
                                            }
                                        },
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————三阶段
                        // 行路难
                        // 敌方角色每次使用技能后失去一点体力
                        HL_xinglunan: {
                            trigger: {
                                global: ['logSkillBegin', 'useSkillBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.isEnemiesOf(player) && !lib.skill.global.includes(event.skill) && !event.getParent('HL_xinglunan', true);
                            },
                            async content(event, trigger, player) {
                                trigger.player.loseHp();
                            },
                        },
                        // 多歧路
                        // 任意牌被使用时,令所有合法目标成为此牌目标
                        HL_duoqilu: {
                            _priority: 20,
                            trigger: {
                                global: ['useCardBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.targets?.length;
                            },
                            async content(event, trigger, player) {
                                const targets = game.players.filter((t) => trigger.player.canUse(trigger.card, t, true));
                                trigger.targets.addArray(targets);
                            },
                        },
                        // 长风破浪会有时
                        // 任意多目标牌被使用后,你可以视作对其中任意一个目标使用x张【杀】(x为指定的目标数)
                        HL_changfengpolang: {
                            trigger: {
                                global: ['useCardEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.targets?.length > 1 && !event.getParent('HL_changfengpolang', true);
                            },
                            async content(event, trigger, player) {
                                let num = trigger.targets.length;
                                const {
                                    result: { targets },
                                } = await player
                                    .chooseTarget(`对其中任意一个目标使用${num}张【杀】`)
                                    .set('filterTarget', (c, p, t) => trigger.targets.includes(t))
                                    .set('ai', (t) => -get.attitude(player, t));
                                if (targets && targets[0]) {
                                    while (num-- > 0) {
                                        await player.useCard({ name: 'sha' }, targets[0], false);
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————四阶段
                        // 千里江陵一日还
                        // 你第三个回合开始时,重新开始三阶段
                        HL_yirihuan: {
                            init(player) {
                                player.storage.HL_yirihuan = 0;
                            },
                            trigger: {
                                player: ['phaseBegin'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `再过${3 - storage}回合,重新开始三阶段`;
                                },
                            },
                            async content(event, trigger, player) {
                                player.storage.HL_yirihuan++;
                                if (player.storage.HL_yirihuan > 2) {
                                    player.storage.HL_yirihuan = 0;
                                    player.qreinit('HL_libai3');
                                    const remove = ['HL_yirihuan', 'HL_wanguchou', 'HL_penghaoren', 'HL_kaixinyan'];
                                    game.skangxing(player, ['HL_xinglunan', 'HL_duoqilu', 'HL_changfengpolang'], remove);
                                    player.removeSkill(remove);
                                    const evt = _status.event.getParent('phase', true);
                                    if (evt) {
                                        evt.finish();
                                    }
                                    player.phase('nodelay');
                                }
                            },
                        },
                        // 与尔同销万古愁
                        // 敌方角色使用牌指定目标时,改为从所有合法目标里随机选择一个
                        HL_wanguchou: {
                            _priority: -20,
                            trigger: {
                                global: ['useCardBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.targets?.length && event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                const targets = game.players.filter((t) => trigger.player.canUse(trigger.card, t, true));
                                const targets1 = targets.randomGets(1);
                                game.log(trigger.card, '目标', trigger.targets, '被改为', targets1);
                                trigger.targets = targets1;
                            },
                        },
                        // 我辈岂是蓬蒿人
                        // 你体力值减少后,随机使用牌堆与弃牌堆各一张可使用的牌
                        // --此技能失去时,将武将牌替换为碎月✬李白
                        HL_penghaoren: {
                            onremove(player, skill) {
                                if (!HL.fangbaozhan) {
                                    HL.fangbaozhan = true;
                                    player.qreinit('HL_李白');
                                    player.bosskangxing = false;
                                    const remove = ['HL_yirihuan', 'HL_wanguchou', 'HL_penghaoren', 'HL_kaixinyan'];
                                    game.skangxing(player, ['醉诗'], remove);
                                    player.removeSkill(remove);
                                    const evt = _status.event.getParent('phase', true);
                                    if (evt) {
                                        evt.finish();
                                    }
                                    player.phase('nodelay');
                                    delete HL.fangbaozhan;
                                }
                            },
                            trigger: {
                                player: ['changeHp'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.num < 0;
                            },
                            async content(event, trigger, player) {
                                for (const bool of [true, false]) {
                                    const cards = bool ? Array.from(ui.cardPile.childNodes) : Array.from(ui.discardPile.childNodes).concat(Array.from(ui.ordering.childNodes));
                                    const card = cards
                                        .randomGets(20)
                                        .filter((q) => player.hasUseTarget(q, true, true))
                                        .randomGet();
                                    if (card) {
                                        await player.chooseUseTarget(card, true, false, 'nodistance');
                                    }
                                }
                            },
                            ai: {
                                maixie: true,
                            },
                        },
                        // 使我不得开心颜
                        // 敌方角色使用♠️️牌后,其失去一点体力;敌方角色使用♥️️牌时,你回复一点体力
                        HL_kaixinyan: {
                            trigger: {
                                global: ['useCardEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.isEnemiesOf(player) && ['heart', 'spade'].includes(event.card.suit);
                            },
                            async content(event, trigger, player) {
                                if (trigger.card.suit == 'heart') {
                                    player.recover();
                                } else {
                                    trigger.player.loseHp();
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————残心
                        // 炼傀
                        // 游戏开始时,你获得三个<傀>
                        // 一名其他非傀儡角色首次受到伤害时,记录其一个技能并获得一个<傀>
                        // 若其为主公,则不记录技能,改为获得四个<傀>,且本轮结束时,视作未对其发动过此技能
                        // 当你获得一个<傀>时,你增加一点体力上限,回复一点体力值并摸两张牌
                        HL_liankui: {
                            init(player) {
                                player.addMark('HL_liankui', 3);
                                player.gainMaxHp(3);
                                player.recover(3);
                                player.draw(6);
                                player.storage.HL_liankui_player = [];
                                player.storage.HL_liankui_skill = [];
                            },
                            trigger: {
                                global: ['damageEnd'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            mark: true,
                            intro: {
                                content: 'mark',
                            },
                            filter(event, player) {
                                return event.player.identity != 'zhu' && !event.player.HL_kuilei && !player.storage.HL_liankui_player.includes(event.player);
                            },
                            async content(event, trigger, player) {
                                player.storage.HL_liankui_player.push(trigger.player);
                                const list = trigger.player.GAS().filter((s) => !player.storage.HL_liankui_skill.includes(s) && s != 'HL_liankui');
                                if (list.length) {
                                    const {
                                        result: { control },
                                    } = await player
                                        .chooseControl(list)
                                        .set(
                                            'choiceList',
                                            list.map(function (i) {
                                                return `<div class='skill'><${get.translation(i)}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                            })
                                        )
                                        .set('displayIndex', false)
                                        .set('prompt', `请选择记录的技能`);
                                    player.storage.HL_liankui_skill.push(control);
                                }
                                player.addMark('HL_liankui');
                                await player.gainMaxHp();
                                player.recover();
                                player.draw(2);
                            },
                            group: ['HL_liankui_1', 'bosshp', 'bossfinish'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['damageEnd'],
                                    },
                                    forced: true,
                                    round: 1,
                                    filter(event, player) {
                                        return event.player == HL.wangzuoboss && !event.player.HL_kuilei;
                                    },
                                    async content(event, trigger, player) {
                                        player.addMark('HL_liankui', 4);
                                        await player.gainMaxHp(4);
                                        player.recover(4);
                                        player.draw(8);
                                    },
                                },
                            },
                        },
                        // 悬丝
                        // 出牌阶段开始时/受到伤害后,你可以移除至多三个<傀>生成一个友方傀儡,赋予其x个已记录的技能(x为消耗的<傀>数)
                        // 所有角色会将傀儡视为队友,傀儡生命上限为3x,初始手牌为4x,傀儡至多三个
                        HL_xuansi: {
                            init(player) {
                                player.storage.HL_liankui_skill = [];
                            },
                            _priority: -100,
                            trigger: {
                                player: ['phaseUseBegin', 'damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return player.storage.HL_liankui > 0 && player.storage.HL_liankui_skill.length && game.players.filter((q) => q.HL_kuilei).length < 3;
                            },
                            async content(event, trigger, player) {
                                const num = Math.min(3, player.storage.HL_liankui);
                                const {
                                    result: { links },
                                } = await player.chooseButton([`生成一个友方傀儡并赋予其至多${num}个已记录的技能`, [player.storage.HL_liankui_skill.map((i) => [i, get.translation(i)]), 'tdnodes']], [1, num]).set('ai', (b) => Math.random());
                                if (links && links[0]) {
                                    const numx = links.length;
                                    player.removeMark('HL_liankui', numx);
                                    const npc = player.addFellow('HL_kuilei');
                                    npc.HL_kuilei = true;
                                    npc.addSkillLog(links);
                                    npc.maxHp = numx * 3;
                                    npc.hp = numx * 3;
                                    npc.update();
                                    npc.draw(numx * 4 - 4);
                                    npc.ai.modAttitudeFrom = function (from, to, att) {
                                        if (to == from.boss) return 99;
                                        return att;
                                    }; //这里from是随从
                                    npc.ai.modAttitudeTo = function (from, to, att) {
                                        return 99;
                                    }; //这里to是随从//所有角色会将傀儡视为队友
                                }
                            },
                        },
                        // 夺形
                        // 每轮开始时,你可以获得一个记录的技能直到此轮结束
                        // 当你体力值不大于0时,若场上有你的傀儡,令随机一个傀儡死亡,你将体力值回复至上限
                        // 当你的傀儡死亡后,你执行一个出牌阶段,若此傀儡体力上限大于5,你获得一个<傀>
                        HL_duoxing: {
                            init(player) {
                                player.storage.HL_liankui_skill = [];
                            },
                            trigger: {
                                global: ['roundStart'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                markcount(storage, player) {
                                    return player.storage.HL_liankui_skill.length;
                                },
                                content(storage, player) {
                                    return `当前已记录技能${get.translation(player.storage.HL_liankui_skill)}`;
                                },
                            },
                            filter(event, player) {
                                return player.storage.HL_liankui_skill.length;
                            },
                            async content(event, trigger, player) {
                                if (player.storage.HL_duoxing) {
                                    player.removeSkill(player.storage.HL_duoxing);
                                }
                                const list = player.storage.HL_liankui_skill;
                                const {
                                    result: { control },
                                } = await player
                                    .chooseControl(list)
                                    .set(
                                        'choiceList',
                                        list.map(function (i) {
                                            return `<div class='skill'><${get.translation(i)}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                        })
                                    )
                                    .set('displayIndex', false)
                                    .set('prompt', `获得一个记录的技能直到此轮结束`);
                                player.storage.HL_duoxing = control;
                                player.addSkillLog(control);
                            },
                            group: ['HL_duoxing_1', 'HL_duoxing_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['changeHp', 'damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return game.players.some((q) => q.HL_kuilei) && player.hp < 1;
                                    },
                                    async content(event, trigger, player) {
                                        const npc = game.players.find((q) => q.HL_kuilei);
                                        if (npc) {
                                            game.log(`<b style='color:rgb(228, 17, 28);'>${get.translation(player)}令${get.translation(npc)}死亡,并将自身体力值回复至上限</b>`);
                                            player.hp = player.maxHp;
                                            player.update();
                                            await npc.die();
                                            npc.HL_kuilei = false;
                                        }
                                    },
                                },
                                2: {
                                    trigger: {
                                        global: ['dieEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.HL_kuilei;
                                    },
                                    async content(event, trigger, player) {
                                        if (trigger.player.maxHp > 5) {
                                            player.addMark('HL_liankui');
                                            await player.gainMaxHp();
                                            player.recover();
                                            player.draw(2);
                                        }
                                        game.log(`<b style='color:rgb(228, 17, 28);'>${get.translation(player)}进行额外出牌阶段</b>`);
                                        await player.phaseUse();
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————太初弈无终·戒律    神      7/7
                        // 天启拈作劫
                        // ①每轮开始时,你从四项律法中选择获得其中两项律法(覆盖之前)
                        // ②敌方角色亵渎对应律法时,其所有技能失效,并获得持续2轮的对应律法的亵渎印记
                        // ③准备阶段,若敌方单个角色的亵渎印记种类数大于1,你进入『真理裁决』3轮
                        HL_tianqi: {
                            init(player) {
                                HL.zhenlicaijue = 0;
                                player.storage.HL_tianqi = ['HL_shengming', 'HL_zhihui', 'HL_zhanzheng', 'HL_weiyan'];
                                player.isHealthy = function () {
                                    return false;
                                }; //回血溢出
                            },
                            trigger: {
                                global: ['roundStart'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage, player) {
                                    return `当前律法${get.translation(HL.lvfa)}`;
                                },
                            },
                            async content(event, trigger, player) {
                                if (HL.zhenlicaijue > 0) {
                                    HL.zhenlicaijue--;
                                    if (HL.zhenlicaijue > 0) {
                                        return;
                                    }
                                }
                                HL.lvfa = [];
                                const {
                                    result: { links },
                                } = await player.chooseButton(['从四项律法中选择获得其中两项律法', [player.storage.HL_tianqi.map((i) => [i, get.translation(i)]), 'tdnodes']], 2, true).set('ai', (b) => Math.random());
                                if (links && links[0]) {
                                    game.log(player, '加入律法', links);
                                    HL.lvfa = links;
                                    if (HL.jielvboss && game.players.includes(HL.jielvboss)) {
                                    } else {
                                        HL.jielvboss = player;
                                    } // 场上只能有一个boss
                                }
                            },
                            group: ['HL_tianqi_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['phaseZhunbeiBegin'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.getEnemies().some((npc) => {
                                            let num = 0;
                                            for (const i of player.storage.HL_tianqi) {
                                                if (npc.storage[`xiedu_${i}`] > 0) {
                                                    num++;
                                                }
                                            }
                                            return num > 1;
                                        });
                                    },
                                    async content(event, trigger, player) {
                                        HL.zhenlicaijue += 3;
                                        player.markSkill('_HL_zhenlicaijue');
                                        HL.lvfa = player.storage.HL_tianqi.slice();
                                        if (HL.jielvboss && game.players.includes(HL.jielvboss)) {
                                        } else {
                                            HL.jielvboss = player;
                                        } // 场上只能有一个boss
                                    },
                                },
                            },
                        },
                        // 真理裁决
                        // 你视为拥有全部律法,且律法增加强化效果
                        // 生命:你回复牌的回复量翻倍
                        // 智慧:摸牌阶段外,你摸牌数翻倍
                        // 战争:你伤害牌的伤害翻倍
                        // 威严:你使用牌时额外结算一次,重铸牌时摸一张牌
                        _HL_zhenlicaijue: {
                            trigger: {
                                player: ['recoverBegin'],
                            },
                            forced: true,
                            intro: {
                                content(storage, player) {
                                    return `真理裁决剩余${HL.zhenlicaijue}轮`;
                                },
                            },
                            filter(event, player) {
                                return HL.zhenlicaijue > 0 && HL.jielvboss == player && event.card && get.tag(event.card, 'recover');
                            },
                            async content(event, trigger, player) {
                                trigger.num *= 2;
                            },
                            group: ['_HL_zhenlicaijue_1', '_HL_zhenlicaijue_2', '_HL_zhenlicaijue_3', '_HL_zhenlicaijue_4'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['drawBegin'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.zhenlicaijue > 0 && HL.jielvboss == player;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num *= 2;
                                    },
                                },
                                2: {
                                    trigger: {
                                        source: ['damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.zhenlicaijue > 0 && HL.jielvboss == player && event.card && get.tag(event.card, 'damage');
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num *= 2;
                                    },
                                },
                                3: {
                                    trigger: {
                                        player: ['useCard'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.zhenlicaijue > 0 && HL.jielvboss == player && event.targets?.length && !['equip', 'delay'].includes(get.type(event.card));
                                    },
                                    async content(event, trigger, player) {
                                        trigger.effectCount++;
                                    },
                                },
                                4: {
                                    trigger: {
                                        player: ['recastEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.zhenlicaijue > 0 && HL.jielvboss == player;
                                    },
                                    async content(event, trigger, player) {
                                        player.draw();
                                    },
                                },
                            },
                        },
                        // 生命律法
                        // 准备阶段和结束阶段,你回复7点体力值
                        // 你回复体力时,若回复值溢出,则摸溢出数量的牌,并增加等量上限
                        // 生命亵渎
                        // 敌方角色回复量大于1时,视为亵渎生命律法
                        // 持有此印记时,无法使用回复牌,无法回复体力值
                        _HL_shengming: {
                            trigger: {
                                player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return HL.lvfa.includes('HL_shengming') && HL.jielvboss == player;
                            },
                            async content(event, trigger, player) {
                                player.recover(7);
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                            group: ['_HL_shengming_1', '_HL_shengming_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['recoverEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.lvfa.includes('HL_shengming') && HL.jielvboss?.isEnemiesOf(player) && event.num > 1;
                                    },
                                    async content(event, trigger, player) {
                                        player.xiedu('xiedu_HL_shengming');
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['recoverBefore'],
                                    },
                                    forced: true,
                                    firstDo: true,
                                    filter(event, player) {
                                        return HL.lvfa.includes('HL_shengming') && HL.jielvboss == player && event.num + player.hp > player.maxHp;
                                    },
                                    async content(event, trigger, player) {
                                        const num = player.hp + trigger.num - player.maxHp;
                                        player.gainMaxHp(num);
                                        player.draw(num);
                                    },
                                },
                            },
                        },
                        xiedu_HL_shengming: {
                            init(player) {
                                if (!player.storage.skill_blocker) {
                                    player.storage.skill_blocker = [];
                                }
                                player.storage.skill_blocker.add('_HL_shengming');
                            },
                            onremove(player) {
                                if (player.storage.skill_blocker) {
                                    player.storage.skill_blocker.remove('_HL_shengming');
                                }
                            },
                            mod: {
                                cardEnabled2(card, player) {
                                    if (get.tag(card, 'recover')) {
                                        return false;
                                    }
                                },
                            },
                            trigger: {
                                player: ['recoverBegin'],
                            },
                            forced: true,
                            kangxing: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `生命亵渎剩余${storage}轮`;
                                },
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['xiedu_HL_shengming_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['roundStart'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.storage.xiedu_HL_shengming--;
                                        if (player.storage.xiedu_HL_shengming < 1) {
                                            player.removeSkill('xiedu_HL_shengming');
                                        }
                                    },
                                },
                            },
                        },
                        // 智慧律法
                        // 准备阶段和结束阶段,你摸七张牌
                        // 智慧亵渎
                        // 敌方角色于摸牌阶段外获得牌时,视为亵渎智慧律法
                        // 持有此印记时,无法使用或打出这些牌,且回合结束时弃置这些牌
                        _HL_zhihui: {
                            trigger: {
                                player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return HL.lvfa.includes('HL_zhihui') && HL.jielvboss == player;
                            },
                            async content(event, trigger, player) {
                                player.draw(7);
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                            group: ['_HL_zhihui_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['gainEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.lvfa.includes('HL_zhihui') && HL.jielvboss?.isEnemiesOf(player) && !event.getParent('phaseDraw', true) && event.cards?.length;
                                    },
                                    async content(event, trigger, player) {
                                        player.xiedu('xiedu_HL_zhihui');
                                        player.addGaintag(trigger.cards, 'xiedu_HL_zhihui');
                                    },
                                },
                            },
                        },
                        xiedu_HL_zhihui: {
                            init(player) {
                                if (!player.storage.skill_blocker) {
                                    player.storage.skill_blocker = [];
                                }
                                player.storage.skill_blocker.add('_HL_zhihui');
                            },
                            onremove(player) {
                                if (player.storage.skill_blocker) {
                                    player.storage.skill_blocker.remove('_HL_zhihui');
                                }
                            },
                            mod: {
                                cardEnabled2(card, player) {
                                    if (card.gaintag && card.gaintag.includes('xiedu_HL_zhihui')) {
                                        return false;
                                    }
                                },
                            },
                            trigger: {
                                player: ['phaseEnd'],
                            },
                            forced: true,
                            kangxing: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `智慧亵渎剩余${storage}轮`;
                                },
                            },
                            filter(event, player) {
                                return player.hasCard((c) => c.gaintag.includes('xiedu_HL_zhihui'), 'he');
                            },
                            async content(event, trigger, player) {
                                player.discard(player.getCards('he', (c) => c.gaintag.includes('xiedu_HL_zhihui')));
                            },
                            group: ['xiedu_HL_zhihui_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['roundStart'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.storage.xiedu_HL_zhihui--;
                                        if (player.storage.xiedu_HL_zhihui < 1) {
                                            player.removeSkill('xiedu_HL_zhihui');
                                        }
                                    },
                                },
                            },
                        },
                        // 战争律法
                        // 你使用伤害牌后,摸造成伤害数张牌或回复等量体力值
                        // 战争亵渎
                        // 敌方角色一回合内使用伤害牌数大于1时,视为亵渎战争律法
                        // 持有此印记时,防止造成的伤害.回合结束时,受到本回合造成伤害数的等量伤害
                        _HL_zhanzheng: {
                            trigger: {
                                player: ['useCardEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                const his = player.actionHistory;
                                const evt = his[his.length - 1];
                                return HL.lvfa.includes('HL_zhanzheng') && HL.jielvboss == player && get.tag(event.card, 'damage') && evt.sourceDamage.some((e) => e.card == event.card);
                            },
                            async content(event, trigger, player) {
                                let num = 0;
                                const his = player.actionHistory;
                                const evt = his[his.length - 1];
                                for (const i of evt.sourceDamage) {
                                    if (i.card == trigger.card) {
                                        num += i.num;
                                    }
                                }
                                const controllist = ['选项一', '选项二'];
                                const choiceList = [`摸${num}张牌`, `回复${num}点体力`];
                                const {
                                    result: { index },
                                } = await player
                                    .chooseControl(controllist)
                                    .set('prompt', '选择一项')
                                    .set('choiceList', choiceList)
                                    .set('ai', function (event, player) {
                                        return controllist.randomGet();
                                    });
                                switch (index) {
                                    case 0:
                                        player.draw(num);
                                        break;
                                    case 1:
                                        player.recover(num);
                                        break;
                                }
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                            group: ['_HL_zhanzheng_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['useCardBegin'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        const his = player.actionHistory;
                                        const evt = his[his.length - 1];
                                        return HL.lvfa.includes('HL_zhanzheng') && HL.jielvboss?.isEnemiesOf(player) && get.tag(event.card, 'damage') && evt.useCard.some((e) => get.tag(e.card, 'damage'));
                                    },
                                    async content(event, trigger, player) {
                                        player.xiedu('xiedu_HL_zhanzheng');
                                    },
                                },
                            },
                        },
                        xiedu_HL_zhanzheng: {
                            init(player) {
                                if (!player.storage.skill_blocker) {
                                    player.storage.skill_blocker = [];
                                }
                                player.storage.skill_blocker.add('_HL_zhanzheng');
                            },
                            onremove(player) {
                                if (player.storage.skill_blocker) {
                                    player.storage.skill_blocker.remove('_HL_zhanzheng');
                                }
                            },
                            trigger: {
                                source: ['damageBefore'],
                            },
                            forced: true,
                            kangxing: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `战争亵渎剩余${storage}轮`;
                                },
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['xiedu_HL_zhanzheng_1', 'xiedu_HL_zhanzheng_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['roundStart'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.storage.xiedu_HL_zhanzheng--;
                                        if (player.storage.xiedu_HL_zhanzheng < 1) {
                                            player.removeSkill('xiedu_HL_zhanzheng');
                                        }
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['phaseEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        const his = player.actionHistory;
                                        const evt = his[his.length - 1];
                                        return evt.sourceDamage.length;
                                    },
                                    async content(event, trigger, player) {
                                        let num = 0;
                                        const his = player.actionHistory;
                                        const evt = his[his.length - 1];
                                        for (const i of evt.sourceDamage) {
                                            num += i.num;
                                        }
                                        player.damage(num);
                                    },
                                },
                            },
                        },
                        // 威严律法
                        // 你成为牌的目标/受到伤害/失去体力时,你摸一张牌
                        // 威严亵渎
                        // 敌方角色使用非回复牌指定你为目标时,视为亵渎威严律法
                        // 持有此印记时,无法指定你为目标.出牌阶段内使用非回复牌后,结束出牌阶段.回合结束时,翻面或跳过下个出牌阶段
                        _HL_weiyan: {
                            trigger: {
                                target: ['useCardToPlayer'],
                                player: ['loseHpEnd', 'damageEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return HL.lvfa.includes('HL_weiyan') && HL.jielvboss == player;
                            },
                            async content(event, trigger, player) {
                                player.draw();
                            },
                            skillBlocker(skill, player) {
                                const info = lib.skill[skill];
                                return info && !info.kangxing;
                            },
                            group: ['_HL_weiyan_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['useCardToPlayer'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.lvfa.includes('HL_weiyan') && HL.jielvboss?.isEnemiesOf(player) && !get.tag(event.card, 'recover') && event.target == HL.jielvboss;
                                    },
                                    async content(event, trigger, player) {
                                        player.xiedu('xiedu_HL_weiyan');
                                    },
                                },
                            },
                        },
                        xiedu_HL_weiyan: {
                            init(player) {
                                if (!player.storage.skill_blocker) {
                                    player.storage.skill_blocker = [];
                                }
                                player.storage.skill_blocker.add('_HL_weiyan');
                            },
                            onremove(player) {
                                if (player.storage.skill_blocker) {
                                    player.storage.skill_blocker.remove('_HL_weiyan');
                                }
                            },
                            mod: {
                                playerEnabled(card, player, target) {
                                    if (target == HL.jielvboss) {
                                        return false;
                                    }
                                },
                            },
                            trigger: {
                                player: ['useCardEnd'],
                            },
                            forced: true,
                            kangxing: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `威严亵渎剩余${storage}轮`;
                                },
                            },
                            filter(event, player) {
                                return !get.tag(event.card, 'recover') && _status.currentPhase == player;
                            },
                            async content(event, trigger, player) {
                                const evt = _status.event.getParent('phaseUse', true);
                                if (evt) {
                                    evt.skipped = true;
                                }
                            },
                            group: ['xiedu_HL_weiyan_1', 'xiedu_HL_weiyan_2'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['roundStart'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        player.storage.xiedu_HL_weiyan--;
                                        if (player.storage.xiedu_HL_weiyan < 1) {
                                            player.removeSkill('xiedu_HL_weiyan');
                                        }
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['phaseEnd'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        const controllist = ['选项一', '选项二'];
                                        const choiceList = ['翻面', '跳过下个出牌阶段'];
                                        const {
                                            result: { index },
                                        } = await player
                                            .chooseControl(controllist)
                                            .set('prompt', '选择一项')
                                            .set('choiceList', choiceList)
                                            .set('ai', function (event, player) {
                                                return controllist.randomGet();
                                            });
                                        switch (index) {
                                            case 0:
                                                player.turnOver(true);
                                                break;
                                            case 1:
                                                player.skip('phaseUse');
                                                break;
                                        }
                                    },
                                },
                            },
                        },
                        // 万神镇诸天
                        // 你无视超出一点的伤害,终止你的判定
                        HL_wanshen: {
                            trigger: {
                                player: ['damageBefore'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            filter(event, player) {
                                return event.num > 1;
                            },
                            async content(event, trigger, player) {
                                trigger.cancel();
                            },
                            group: ['bosshp', 'bossfinish', 'HL_wanshen_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['judgeBefore'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.cancel();
                                        trigger.result = { card: {} };
                                    },
                                },
                            },
                        },
                        // 劫命归一子
                        // 当你对敌方角色造成伤害/成为敌方角色牌的目标后,你令其获得随机一个亵渎印记持续2轮【优先获得已持有律法所对应的亵渎印记】
                        HL_jieming: {
                            init(player) {
                                player.storage.HL_tianqi = ['HL_shengming', 'HL_zhihui', 'HL_zhanzheng', 'HL_weiyan'];
                            },
                            trigger: {
                                target: ['useCardToPlayer'],
                                source: ['damageEnd'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                const yinji = HL.lvfa.length ? HL.lvfa.randomGet() : player.storage.HL_tianqi.randomGet();
                                if (yinji) {
                                    trigger.player.xiedu(`xiedu_${yinji}`);
                                }
                            },
                        },
                        // 一子定万律
                        // 每回合结束时,对该回合内获得过亵渎印记的敌方角色造成2点伤害.若其亵渎印记种类数大于1,则改为失去你持有律法数的体力值
                        // 若其失去的体力值小于你持有律法数,则重复此流程,直到其脱离濒死状态
                        HL_wanlv: {
                            init(player) {
                                player.storage.HL_tianqi = ['HL_shengming', 'HL_zhihui', 'HL_zhanzheng', 'HL_weiyan'];
                            },
                            trigger: {
                                global: ['phaseEnd'],
                            },
                            forced: true,
                            filter(event, player, name) {
                                return player.getEnemies().some((q) => q.xiedujilu);
                            },
                            async content(event, trigger, player) {
                                for (const npc of player.getEnemies().filter((q) => q.xiedujilu)) {
                                    npc.xiedujilu = false;
                                    let num = 0;
                                    for (const i of player.storage.HL_tianqi) {
                                        if (npc.storage[`xiedu_${i}`] > 0) {
                                            num++;
                                        }
                                    }
                                    if (num > 1) {
                                        HL.wanlv = true;
                                        npc.when({ player: ['dyingEnd', 'phaseAfter'] }).then(() => (HL.wanlv = false));
                                        let numx = 24;
                                        while (HL.wanlv && numx-- > 0) {
                                            const num1 = npc.hp;
                                            await npc.loseHp(HL.lvfa.length);
                                            if (num1 - npc.hp >= HL.lvfa.length) {
                                                break;
                                            }
                                        }
                                    } else {
                                        npc.damage(2);
                                    }
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————五河琴里 5/5
                        // 灼烂歼鬼
                        // ❶其他角色/你使用或打出点数为5的牌时,你分配1/5点火焰伤害
                        // ❷你造成火焰伤害后,令目标获得等量<燃>(此效果狂暴下失效);你受到的火焰伤害视为回复体力
                        // ❸有<燃>的角色受到火焰伤害后,令场上其他有<燃>的角色移除一枚<燃>并受到等量无来源火属性伤害(此效果狂暴下失效)
                        HL_zhuolan: {
                            init(player) {
                                game.playAudio(`../extension/火灵月影/audio/qinli_init${[1, 2, 3].randomGet()}.mp3`);
                                const info = lib.character[player.name];
                                let maxhp = Math.max(info.maxHp, player.maxHp);
                                Reflect.defineProperty(player, 'maxHp', {
                                    get() {
                                        return maxhp;
                                    },
                                    set(value) {
                                        if (value > maxhp) {
                                            maxhp = value;
                                        }
                                    },
                                }); //扣减体力上限抗性
                                game.skangxing(player); //移除/赋空技能抗性
                                // let skills = [];
                                // Reflect.defineProperty(player, 'skills', {
                                //     get() {
                                //         skills = skills.filter((s) => ['counttrigger', 'jiu'].includes(s));
                                //         return skills;//喝酒技能无法添加导致无限红温,counttrigger技能无法添加导致触发技无限发动
                                //     },
                                //     set() { },
                                // });//添加技能抗性
                                player.disabledSkills = new Proxy(
                                    {},
                                    {
                                        get(u, i) {
                                            return [];
                                        },
                                    }
                                ); //技能失效抗性
                                const storage = Object.assign({}, player.storage); //清空代理
                                player.storage = new Proxy(storage, {
                                    get(u, i) {
                                        if (i == 'skill_blocker') return [];
                                        if (i.startsWith('temp_ban_')) return false;
                                        return u[i];
                                    },
                                }); //技能失效抗性//不能直接用空对象初始化,会清空之前技能的init里面的storage
                                // 也不能直接用player.storage初始化,导致多次代理包裹
                            },
                            mod: {
                                aiValue(player, card, num) {
                                    if (card.number == 5) {
                                        return num + 50;
                                    }
                                },
                            },
                            trigger: {
                                global: ['useCard', 'respond'],
                            },
                            filter(event, player) {
                                return event.card.number == 5;
                            },
                            markimage: 'extension/火灵月影/image/HL_zhuolan.png',
                            intro: {
                                content: 'mark',
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                let num = 1;
                                if (trigger.player == player) {
                                    num = 5;
                                }
                                const list = new Map();
                                while (num > 0) {
                                    const {
                                        result: { targets },
                                    } = await player.chooseTarget(`分配${num}点火焰伤害`).set('ai', (t) => {
                                        if (t == player && !player.HL_kuangbao) {
                                            return (player.maxHp - player.hp) * 4;
                                        }
                                        return -get.attitude(player, t);
                                    });
                                    if (targets && targets[0]) {
                                        num--;
                                        const index = list.get(targets[0]);
                                        if (!index) {
                                            list.set(targets[0], 1);
                                        } else {
                                            list.set(targets[0], index + 1);
                                        }
                                    } else {
                                        break;
                                    }
                                }
                                if (list.size > 0) {
                                    if (trigger.player == player) {
                                        game.playAudio(`../extension/火灵月影/audio/qinli_zhuolan${[4, 5, 6].randomGet()}.mp3`);
                                    } else {
                                        game.playAudio(`../extension/火灵月影/audio/qinli_zhuolan${[1, 2, 3].randomGet()}.mp3`);
                                    }
                                    for (const [target, num] of list) {
                                        await target.damage(num, 'fire');
                                    }
                                }
                            },
                            group: ['HL_zhuolan_1', 'HL_zhuolan_2', 'HL_zhuolan_3'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        source: ['damageAfter'],
                                    },
                                    filter(event, player) {
                                        return event.nature == 'fire' && event.num > 0 && !player.HL_kuangbao;
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        trigger.player.addMark('HL_zhuolan', trigger.num);
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['damageBefore'],
                                    },
                                    filter(event, player) {
                                        return event.nature == 'fire' && event.num > 0;
                                    },
                                    forced: true,
                                    firstDo: true,
                                    async content(event, trigger, player) {
                                        trigger.setContent(async function (event, trigger, player) {
                                            await event.trigger('damageBegin1');
                                            await event.trigger('damageBegin2');
                                            await event.trigger('damageBegin3');
                                            await event.trigger('damageBegin4');
                                            await event.trigger('recoverBefore');
                                            await event.trigger('recoverBegin');
                                            if (event.num > 0) {
                                                delete event.filterStop;
                                                if (lib.config.background_audio) {
                                                    game.playAudio('effect', 'recover');
                                                }
                                                game.broadcast(function () {
                                                    if (lib.config.background_audio) {
                                                        game.playAudio('effect', 'recover');
                                                    }
                                                });
                                                game.broadcastAll(function (player) {
                                                    if (lib.config.animation && !lib.config.low_performance) {
                                                        player.$recover();
                                                    }
                                                }, player);
                                                player.$damagepop(event.num, 'wood');
                                                game.log(player, '回复了' + get.cnNumber(event.num) + '点体力');
                                                await player.changeHp(event.num, false);
                                            } else {
                                                event._triggered = null;
                                            }
                                            await event.trigger('recoverEnd');
                                            await event.trigger('recoverAfter'); //补齐recover时机
                                            event.step = 6;
                                        }); //async内部不await,会卡掉前面的事件
                                        //一个async中有俩异步事件的话,其中一个必须await一下
                                    },
                                },
                                3: {
                                    trigger: {
                                        global: ['damageEnd'],
                                    },
                                    filter(event, player) {
                                        return event.nature == 'fire' && event.player.countMark('HL_zhuolan') && game.players.some((q) => q.countMark('HL_zhuolan') && q != event.player) && event.num > 0 && !player.HL_kuangbao;
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        for (const npc of game.players.filter((q) => q.countMark('HL_zhuolan') && q != trigger.player)) {
                                            npc.removeMark('HL_zhuolan');
                                            await npc.damage(trigger.num, 'fire', 'nosource');
                                        }
                                    },
                                },
                            },
                        },
                        // 交战!
                        // 每回合限x次(x=你体力上限-体力值+1),当你成为其他人使用牌的目标时,可以:
                        // 弃置一张不同颜色的牌,令其无效
                        // 弃置一张同花色的牌,令其无效并获得之
                        HL_jiaozhan: {
                            usable(skill, player) {
                                return player.maxHp - player.hp + 1;
                            },
                            trigger: {
                                target: ['useCardToPlayer'],
                            },
                            filter(event, player) {
                                return event.player != player;
                            },
                            forced: true,
                            mark: true,
                            markimage: 'extension/火灵月影/image/HL_jiaozhan.png',
                            intro: {
                                markcount(storage, player) {
                                    return player.maxHp - player.hp + 1 - number0(player.storage.counttrigger?.HL_jiaozhan);
                                },
                                content(storage, player) {
                                    return `本回合还可发动${player.maxHp - player.hp + 1 - number0(player.storage.counttrigger?.HL_jiaozhan)}次`;
                                },
                            },
                            async content(event, trigger, player) {
                                const info = get.translation(trigger.card);
                                const {
                                    result: { cards },
                                } = await player
                                    .chooseToDiscard(`弃置一张不同颜色的牌,令${info}无效;或弃置一张同花色的牌,令${info}无效并获得之`, 'he')
                                    .set('filterCard', (c) => get.color(c) != get.color(trigger.card) || c.suit == trigger.card.suit)
                                    .set('ai', (c) => -get.effect(player, trigger.card, trigger.player, player) - get.value(c));
                                if (cards && cards[0]) {
                                    game.playAudio(`../extension/火灵月影/audio/qinli_jiaozhan${[1, 2, 3].randomGet()}.mp3`);
                                    trigger.parent.all_excluded = true;
                                    if (cards[0].suit == trigger.card.suit && trigger.cards?.length) {
                                        player.gain(trigger.cards, 'gain2');
                                    }
                                    player.markSkill('HL_jiaozhan');
                                } else {
                                    player.storage.counttrigger.HL_jiaozhan--;
                                }
                            },
                        },
                        // 神威灵装·五番
                        // 你的手牌数始终为5,你每因此技能摸/弃一张牌,增加1个【严厉】/【残酷】标记
                        // 当【严厉】/【残酷】标记数大于9时触发以下效果,然后将标记数归零:
                        // ①严厉:你可弃置自己区域内任意张牌,观看一名其他角色的手牌,获得其一张牌
                        // ②残酷:移除一名其他角色的全部技能,直到你的回合结束
                        HL_wufan: {
                            trigger: {
                                player: ['loseEnd', 'gainEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return player.countCards('h') != 5;
                            },
                            async content(event, trigger, player) {
                                const num = player.countCards('h') - 5;
                                if (num > 0) {
                                    await player.chooseToDiscard(true, num, 'h').set('ai', (c) => {
                                        if (player.isPhaseUsing()) {
                                            if (player.hasValueTarget(c, null, true)) return -1;
                                            return 20 - get.value(c);
                                        }
                                        return 6 - get.useful(c);
                                    });
                                    player.addMark('HL_wufan_2', num);
                                    if (player.storage.HL_wufan_2 > 9) {
                                        await player.canku();
                                    }
                                } else {
                                    await player.draw(-num);
                                    player.addMark('HL_wufan_1', -num);
                                    if (player.storage.HL_wufan_1 > 9) {
                                        await player.yanli();
                                    }
                                }
                            },
                            ai: {
                                effect: {
                                    player(card, player, target) {
                                        if (lib.card[card.name]) {
                                            if (player.getEquips('zhuge') && get.subtype(card) == 'equip1' && card.name != 'zhuge') {
                                                return -1;
                                            }
                                            return [1, 1.6]; //无脑用牌
                                        }
                                    },
                                },
                            },
                            group: ['HL_wufan_1', 'HL_wufan_2', 'HL_wufan_3'],
                            subSkill: {
                                1: {
                                    markimage: 'extension/火灵月影/image/HL_wufan_1.png',
                                    intro: {
                                        content: 'mark',
                                    },
                                    audio: 'ext:火灵月影/audio:3',
                                    trigger: {
                                        player: ['changeHpEnd'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.num < 0;
                                    }, //掉真血才触发
                                    async content(event, trigger, player) { },
                                }, // 受伤语音
                                2: {
                                    markimage: 'extension/火灵月影/image/HL_wufan_2.png',
                                    intro: {
                                        content: 'mark',
                                    },
                                    trigger: {
                                        source: ['damage'],
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        if (player.HL_kuangbao) {
                                            game.playAudio(`../extension/火灵月影/audio/qinli_sourcedamage${[4, 5, 6].randomGet()}.mp3`);
                                        } else {
                                            game.playAudio(`../extension/火灵月影/audio/qinli_sourcedamage${[1, 2, 3].randomGet()}.mp3`);
                                        }
                                    },
                                },
                                3: {
                                    trigger: {
                                        player: ['phaseAfter'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return game.players.some((q) => q.storage.HL_wufan?.length);
                                    },
                                    async content(event, trigger, player) {
                                        for (const npc of game.players.filter((q) => q.storage.HL_wufan?.length)) {
                                            npc.addSkill(npc.storage.HL_wufan);
                                            npc.storage.HL_wufan = [];
                                            game.log(player, '归还了', npc, '的技能');
                                        }
                                    },
                                },
                            },
                        },
                        // 自愈
                        // 每五个任意回合后,你回复1点体力
                        // 你回复体力时,若此回复溢出,将之转变为护甲
                        HL_ziyu: {
                            markimage: 'extension/火灵月影/image/HL_ziyu.png',
                            intro: {
                                content(storage) {
                                    return `还有${storage}回合自愈`;
                                },
                            },
                            trigger: {
                                global: ['phaseEnd'],
                            },
                            forced: true,
                            init(player) {
                                player.addMark('HL_ziyu', 5);
                                player.isHealthy = function () {
                                    return false;
                                }; //回血溢出
                                player.when({ global: 'gameStart' }).then(() => player.classList.add('qinli')); //游戏开始前加不上
                            },
                            async content(event, trigger, player) {
                                player.removeMark('HL_ziyu');
                                if (player.storage.HL_ziyu < 1) {
                                    player.addMark('HL_ziyu', 5);
                                    game.playAudio(`../extension/火灵月影/audio/qinli_ziyu${[1, 2, 3].randomGet()}.mp3`);
                                    player.recover();
                                }
                            },
                            group: ['HL_ziyu_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['recoverBefore'],
                                    },
                                    forced: true,
                                    firstDo: true,
                                    filter(event, player) {
                                        return event.num + player.hp > player.maxHp;
                                    },
                                    async content(event, trigger, player) {
                                        const num = player.hp + trigger.num - player.maxHp;
                                        game.log(player, '将回复转变为护甲');
                                        player.changeHujia(num);
                                    },
                                },
                            },
                        },
                        // 狂暴
                        // 当你死亡前,若你处于狂暴状态则取消之
                        // 否则你进入狂暴状态,直至无伤害牌可出或任意敌方被你击杀
                        // 清除所有【严厉】/【残酷】标记,并发动一次对应效果
                        // 狂暴状态下,你只可使用伤害牌.每使用一张伤害牌,下一次造成的伤害翻倍
                        // 若有敌方被你击杀,你取消你的死亡结算,将体力至少回复至1
                        HL_kuangbao: {
                            mod: {
                                aiUseful(player, card, num) {
                                    if (player.hp < 3 && get.tag(card, 'damage')) {
                                        return num + 50;
                                    }
                                },
                            },
                            trigger: {
                                player: ['dieBefore'],
                            },
                            audio: 'ext:火灵月影/audio:3',
                            forced: true,
                            async content(event, trigger, player) {
                                if (player.HL_kuangbao) {
                                    game.playAudio(`../extension/火灵月影/audio/qinli_fuhuo${[1, 2, 3].randomGet()}.mp3`);
                                    trigger.cancel();
                                } else {
                                    await player.canku();
                                    await player.yanli();
                                    game.log(player, '进入狂暴');
                                    player.HL_kuangbao = true;
                                    player.classList.add('linked');
                                    let bool = true;
                                    while (player.HL_kuangbao) {
                                        const { result } = await player
                                            .chooseToUse()
                                            .set('filterCard', (c) => player.filterCardx(c) && get.tag(c, 'damage'))
                                            .set('filterTarget', (c, p, t) => t != p)
                                            .set('ai1', (card, arg) => {
                                                if (lib.card[card.name]) {
                                                    return number0(player.getUseValue(card, null, true)) + 10;
                                                }
                                            });
                                        if (!result.bool) {
                                            game.log(player, '退出狂暴');
                                            player.HL_kuangbao = false;
                                            player.classList.remove('linked');
                                            bool = false;
                                        }
                                    }
                                    player.clearMark('HL_kuangbao_2');
                                    if (bool) {
                                        game.playAudio(`../extension/火灵月影/audio/qinli_fuhuo${[1, 2, 3].randomGet()}.mp3`);
                                        trigger.cancel();
                                        player.hp = Math.max(1, player.hp);
                                        player.update();
                                    }
                                }
                            },
                            group: ['HL_kuangbao_1', 'HL_kuangbao_2', 'HL_kuangbao_3'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        source: ['dieAfter'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return event.player.isEnemiesOf(player, true) && player.HL_kuangbao;
                                    },
                                    async content(event, trigger, player) {
                                        game.log(player, '退出狂暴');
                                        player.HL_kuangbao = false;
                                        player.classList.remove('linked');
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['useCard'],
                                    },
                                    forced: true,
                                    markimage: 'extension/火灵月影/image/HL_kuangbao_2.png',
                                    intro: {
                                        content(storage) {
                                            return `下一次造成的伤害翻${Math.pow(2, storage)}倍`;
                                        },
                                    },
                                    filter(event, player) {
                                        return get.tag(event.card, 'damage') && player.HL_kuangbao;
                                    },
                                    async content(event, trigger, player) {
                                        player.addMark('HL_kuangbao_2');
                                    },
                                },
                                3: {
                                    trigger: {
                                        source: ['damageBegin4'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.countMark('HL_kuangbao_2') && player.HL_kuangbao;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num = numberq1(trigger.num) * Math.pow(2, player.countMark('HL_kuangbao_2'));
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————乐极生悲
                        // 任意角色受伤害后,其去除一枚<乐>,所有其他角色获得一枚<乐>
                        // 此领域被移除时,场上<乐>最多的角色随机弃置其<乐>数的牌,其他角色摸其<乐>数的牌,清除全场所有<乐>
                        g_lejishengbei: {
                            trigger: {
                                player: ['damageEnd'],
                            },
                            forced: true,
                            markimage: 'extension/火灵月影/image/lejishengbei.jpg',
                            intro: {
                                content: 'mark',
                            },
                            filter(event, player) {
                                return HL.lejishengbei;
                            },
                            async content(event, trigger, player) {
                                for (const npc of game.players) {
                                    if (npc == player) {
                                        npc.removeMark('g_lejishengbei');
                                    } else {
                                        npc.addMark('g_lejishengbei');
                                    }
                                }
                            },
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['phaseBegin'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return HL.lejishengbei && (HL.lejishengbei == player || !game.players.includes(HL.lejishengbei));
                                    },
                                    async content(event, trigger, player) {
                                        game.removeGlobalSkill('g_lejishengbei');
                                        game.removeGlobalSkill('g_lejishengbei_1');
                                        let maxnum = Math.max(...game.players.map((q) => q.countMark('g_lejishengbei')));
                                        if (maxnum > 0) {
                                            const maxplayer = game.players.filter((q) => q.countMark('g_lejishengbei') == maxnum);
                                            for (const npc of game.players) {
                                                if (maxplayer.includes(npc)) {
                                                    npc.randomDiscard('he', npc.countMark('g_lejishengbei'));
                                                } else {
                                                    npc.draw(npc.countMark('g_lejishengbei'));
                                                }
                                                npc.clearMark('g_lejishengbei');
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————火  100体力
                        // 王道火
                        // 游戏开始时,所有敌人受到压制,你武将牌技能外的一切技能均无法发动
                        // 任意展示/判定事件中,由你指定其花色点数牌名
                        HL_wangdaox: {
                            trigger: {
                                global: ['showCardsAfter', 'judgeAfter'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                const list1 = lib.suits;
                                const list2 = lib.number.slice();
                                const list3 = Object.keys(lib.card).filter((i) => {
                                    const info = lib.card[i];
                                    if (info.mode && !info.mode.includes(lib.config.mode)) {
                                        return false;
                                    }
                                    return info.content && !['delay', 'equip'].includes(info.type);
                                });
                                const {
                                    result: { links },
                                } = await player
                                    .chooseButton(['指定其花色点数牌名', [list1.map((i) => [i, get.translation(i)]), 'tdnodes'], [list2, 'tdnodes'], [list3, 'vcard']], 3)
                                    .set('filterButton', (button) => {
                                        for (const arr of [list1, list2]) {
                                            if (arr.includes(button.link) && ui.selected.buttons.some((b) => arr.includes(b.link))) {
                                                return false;
                                            }
                                        }
                                        if (list3.includes(button.link[2]) && ui.selected.buttons.some((b) => list3.includes(b.link[2]))) {
                                            return false;
                                        }
                                        return true;
                                    })
                                    .set('ai', (button) => {
                                        if (trigger.name == 'showCards') {
                                            return Math.random();
                                        }
                                        const card = {};
                                        if (list1.includes(button.link)) {
                                            card.suit = button.link;
                                        }
                                        if (list2.includes(button.link)) {
                                            card.number = button.link;
                                        }
                                        if (list3.includes(button.link[2])) {
                                            card.name = button.link[2];
                                        }
                                        return get.attitude(player, trigger.player) * trigger.judge(card);
                                    });
                                if (links?.length) {
                                    const card = {};
                                    for (const link of links) {
                                        if (list1.includes(link)) {
                                            card.suit = link;
                                        }
                                        if (list2.includes(link)) {
                                            card.number = link;
                                        }
                                        if (list3.includes(link[2])) {
                                            card.name = link[2];
                                        }
                                    }
                                    if (trigger.name == 'showCards') {
                                        for (const cardx of trigger.cards) {
                                            cardx.init(card);
                                        }
                                    } else {
                                        trigger.result = {
                                            card: card,
                                            judge: trigger.judge(card),
                                            number: card.number,
                                            suit: card.suit,
                                            color: get.color(card),
                                        };
                                    }
                                }
                            },
                            group: ['HL_wangdaox_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        global: ['logSkillBegin', 'useSkillBegin'],
                                    },
                                    filter(event, player, name) {
                                        const infox = lib.character[player.name];
                                        if (infox?.skills?.includes(event.skill)) {
                                            return false;
                                        }
                                        return lib.skill[event.skill] && !lib.skill.global.includes(event.skill);
                                    },
                                    forced: true,
                                    popup: false,
                                    async content(event, trigger, player) {
                                        const name = trigger.skill;
                                        const info = lib.skill[name];
                                        if (!(info.HL_wangdaox > 0)) {
                                            if (trigger.name == 'logSkillBegin') {
                                                const arr = trigger.parent.next;
                                                for (let i = arr.length - 1; i >= 0; i--) {
                                                    if (arr[i].name === name) {
                                                        arr.splice(i, 1);
                                                    }
                                                }
                                            } //被终止的触发技也会计入次数
                                            else {
                                                const stat = trigger.player.stat;
                                                const statskill = stat[stat.length - 1].skill;
                                                statskill[name] = numberq0(statskill[name]) + 1;
                                                if (info.sourceSkill) {
                                                    statskill[info.sourceSkill] = numberq0(statskill[info.sourceSkill]) + 1;
                                                }
                                                trigger.cancel();
                                            } //被终止的主动技不会计入次数,要手动加一下
                                            game.log(player, `终止${get.translation(name)}的发动`);
                                            if (info.limited || info.juexingji) {
                                                trigger.player.awakenSkill(name);
                                            }
                                        } else {
                                            info.HL_wangdaox--;
                                        }
                                    },
                                },
                            },
                        },
                        // 不灭炎
                        // 你受到伤害时,改为扣除等量体力上限并摸等量牌
                        // 你回复生命时,改为增加等量体力上限并分配等量火焰伤害
                        // 你的体力值始终等于体力上限-1,你拥有9限伤
                        HL_buyun: {
                            init(player) {
                                const info = lib.character[player.name];
                                let maxhp = Math.max(info.maxHp, player.maxHp);
                                Reflect.defineProperty(player, 'maxHp', {
                                    get() {
                                        return maxhp;
                                    },
                                    set(value) {
                                        if (value > maxhp) {
                                            maxhp = value;
                                        } else if (player.success) {
                                            maxhp = value;
                                        }
                                    },
                                }); //扣减体力上限抗性
                                Reflect.defineProperty(player, 'hp', {
                                    get() {
                                        return player.maxHp - 1;
                                    },
                                    set() { },
                                });
                                Reflect.defineProperty(player, 'skipList', {
                                    get() {
                                        return [];
                                    },
                                    set() { },
                                });
                            },
                            trigger: {
                                player: ['damageBefore', 'recoverBefore'],
                            },
                            kangxing: true,
                            charlotte: true,
                            fixed: true,
                            forced: true,
                            async content(event, trigger, player) {
                                if (trigger.name == 'damage') {
                                    trigger.cancel();
                                    await player.draw(trigger.num);
                                    player.success = true;
                                    await player.loseMaxHp(Math.min(trigger.num, 9));
                                    player.success = false;
                                } else {
                                    trigger.cancel();
                                    await player.gainMaxHp(trigger.num);
                                    let num = Math.min(numberq1(trigger.num), 9);
                                    const list = new Map();
                                    while (num > 0) {
                                        const {
                                            result: { targets },
                                        } = await player.chooseTarget(`分配${num}点火焰伤害`).set('ai', (t) => {
                                            return -get.attitude(player, t);
                                        });
                                        if (targets && targets[0]) {
                                            num--;
                                            const index = list.get(targets[0]);
                                            if (!index) {
                                                list.set(targets[0], 1);
                                            } else {
                                                list.set(targets[0], index + 1);
                                            }
                                        } else {
                                            break;
                                        }
                                    }
                                    if (list.size > 0) {
                                        for (const [target, num] of list) {
                                            await target.damage(num, 'fire');
                                        }
                                    }
                                }
                            },
                            group: ['bossfinish'],
                        },
                        // 起锋焱
                        // 你体力上限变化一点时,随机获得一个技能,你随机『2』个非武将牌上技能可使用次数+1,所有敌方角色随机技能可使用次数+1
                        HL_qifeng: {
                            trigger: {
                                player: ['loseMaxHpEnd', 'gainMaxHpEnd'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                let num = Math.min(numberq1(trigger.num), 9);
                                while (num-- > 0) {
                                    const skill = Object.keys(lib.skill)
                                        .filter((i) => lib.translate[`${i}_info`])
                                        .randomGet();
                                    player.addAdditionalSkill('HL_qifeng', skill, true);
                                    const numx = player.storage.HL_pojie + 2 || 2;
                                    const skills = player
                                        .GS()
                                        .filter((i) => {
                                            const info = lib.character[player.name];
                                            if (info && info.skills) {
                                                return !info.skills.includes(i);
                                            }
                                            return true;
                                        })
                                        .randomGets(numx);
                                    for (const skillx of skills) {
                                        const info = lib.skill[skillx];
                                        try {
                                            info.HL_wangdaox ??= 0;
                                            info.HL_wangdaox++;
                                            game.log(player, skillx, '可使用次数置为', info.HL_wangdaox);
                                        } catch (e) {
                                            console.warn(skillx, '可使用次数无法修改');
                                        }
                                    }
                                    for (const npc of player.getEnemies()) {
                                        const skillx = npc.GS().randomGet();
                                        if (skillx) {
                                            const info = lib.skill[skillx];
                                            try {
                                                info.HL_wangdaox ??= 0;
                                                info.HL_wangdaox++;
                                                game.log(npc, skillx, '可使用次数置为', info.HL_wangdaox);
                                            } catch (e) {
                                                console.warn(skillx, '可使用次数无法修改');
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        // 破劫燚
                        // 你体力上限首次降至『90-10x』以下时,将体力上限调整为『90-10x』
                        // 随机获得x个技能,令自身造成的伤害/摸牌数/使用杀的次数+x,且<起锋>括号内数字+1(x此技能已发动次数)
                        HL_pojie: {
                            init(player) {
                                player.storage.HL_pojie = 0;
                            },
                            trigger: {
                                player: ['loseMaxHpEnd'],
                            },
                            forced: true,
                            mark: true,
                            intro: {
                                content(storage) {
                                    return `造成的伤害/摸牌数/使用杀的次数+${factorial(storage)}`;
                                },
                            },
                            filter(event, player) {
                                return player.maxHp < 90 - 10 * player.storage.HL_pojie;
                            },
                            async content(event, trigger, player) {
                                await player.gainMaxHp(90 - 10 * player.storage.HL_pojie - player.maxHp);
                                player.storage.HL_pojie++;
                                const skills = Object.keys(lib.skill)
                                    .filter((i) => lib.translate[`${i}_info`])
                                    .randomGets(player.storage.HL_pojie);
                                player.addAdditionalSkill('HL_qifeng', skills, true);//这些获得的技能不能加抗性,不然随机到觉醒技会无限放
                            },
                            group: ['HL_pojie_1', 'HL_pojie_2'],
                            subSkill: {
                                1: {
                                    mod: {
                                        cardUsable(card, player, num) {
                                            if (card.name == 'sha' && player.storage.HL_pojie > 0) {
                                                return num + factorial(player.storage.HL_pojie);
                                            }
                                        },
                                    },
                                    trigger: {
                                        source: ['damageBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.storage.HL_pojie > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num += factorial(player.storage.HL_pojie);
                                    },
                                },
                                2: {
                                    trigger: {
                                        player: ['drawBefore'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.storage.HL_pojie > 0;
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num += factorial(player.storage.HL_pojie);
                                    },
                                },
                            },
                        },
                    },
                    dynamicTranslate: {
                        HL_qifeng(player) {
                            const numx = player.storage.HL_pojie || 0;
                            return `你体力上限变化一点时,随机获得一个技能,你随机『${numx + 2}』个非武将牌上技能可使用次数+1,所有敌方角色随机技能可使用次数+1`;
                        },
                        HL_pojie(player) {
                            const numx = player.storage.HL_pojie || 0;
                            const num = 90 - 10 * numx;
                            return `你体力上限首次降至『${num}』以下时,将体力上限调整为『${num}』<br>随机获得『${numx}』个技能,令自身造成的伤害/摸牌数/使用杀的次数+『${numx}』,且<起锋>括号内数字+1`;
                        },
                    },
                    translate: {
                        //——————————————————————————————————————————————————————————————————————————————————————————————————
                        HL_: '',
                        HL_: '',
                        HL__info: '',
                        HL_: '',
                        HL__info: '',
                        HL_: '',
                        HL__info: '',
                        HL_: '',
                        HL__info: '',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————火  100体力
                        HL_huo: '<span class="flame">火</span>',
                        HL_wangdaox: '王道<span class="flame">火</span>',
                        HL_wangdaox_info: '游戏开始时,所有敌人受到压制,你武将牌技能外的一切技能均无法发动<br>任意展示/判定事件中,由你指定其花色点数牌名',
                        HL_buyun: '不灭<span class="flame">炎</span>',
                        HL_buyun_info: '你受到伤害时,改为扣除等量体力上限并摸等量牌<br>你回复生命时,改为增加等量体力上限并分配等量火焰伤害<br>你的体力值始终等于体力上限-1,你拥有9限伤',
                        HL_qifeng: '起锋<span class="flame">焱</span>',
                        HL_qifeng_info: '你体力上限变化一点时,随机获得一个技能,你随机『2』个非武将牌上技能可使用次数+1,所有敌方角色随机技能可使用次数+1',
                        HL_pojie: '破劫<span class="flame">燚</span>',
                        HL_pojie_info: '你体力上限首次降至『90-10x』以下时,将体力上限调整为『90-10x』<br>随机获得『x』个技能,令自身造成的伤害/摸牌数/使用杀的次数+『x』,且<起锋>括号内数字+1(x此技能已发动次数)',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————乐极生悲
                        g_lejishengbei: '乐极生悲',
                        g_lejishengbei_info: '任意角色受伤害后,其去除一枚<乐>,所有其他角色获得一枚<乐><br>此领域被移除时,场上<乐>最多的角色随机弃置其<乐>数的牌,其他角色摸其<乐>数的牌,清除全场所有<乐>',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————五河琴里 5/5
                        HL_qinli: '<b style="color: #FF0000">五河琴里</b>',
                        HL_zhuolan: '灼烂歼鬼',
                        HL_zhuolan_info: '❶其他角色/你使用或打出点数为5的牌时,你分配1/5点火焰伤害<br>❷你造成火焰伤害后,令目标获得等量<燃>(此效果狂暴下失效);你受到的火焰伤害视为回复体力<br>❸有<燃>的角色受到火焰伤害后,令场上其他有<燃>的角色移除一枚<燃>并受到等量无来源火属性伤害(此效果狂暴下失效)',
                        HL_zhuolan_append: '<b style="color:rgba(230, 87, 21, 1); font-size: 15px;">琴里的守护天使,可在战斧和臂炮间自由切换形态以适应战局</b>',
                        HL_jiaozhan: '交战!',
                        HL_jiaozhan_info: '每回合限x次(x=你体力上限-体力值+1),当你成为其他人使用牌的目标时,可以:<br>弃置一张不同颜色的牌,令其无效<br>弃置一张同花色的牌,令其无效并获得之',
                        HL_jiaozhan_append: '<b style="color:rgba(230, 87, 21, 1); font-size: 15px;">痛愈彻骨焰愈啸,伤至濒绝战至狂</b>',
                        HL_wufan: '神威灵装·五番',
                        HL_wufan_info: '你的手牌数始终为5,你每因此技能摸/弃一张牌,增加1个【严厉】/【残酷】标记<br>当【严厉】/【残酷】标记数大于9时触发以下效果,然后将标记数归零:<br>①严厉:你可弃置自己区域内任意张牌,观看一名其他角色的手牌,获得其一张牌<br>②残酷:移除一名其他角色的全部技能,直到你的回合结束',
                        HL_wufan_append: '<b style="color:rgba(230, 87, 21, 1); font-size: 15px;">琴里的精灵装束,梦幻般的和风羽织,由浓密的灵力构成,轻盈可爱</b>',
                        HL_wufan_1: '严厉',
                        HL_wufan_1_info: '你可弃置自己区域内任意张牌,观看一名其他角色的手牌,获得其一张牌',
                        HL_wufan_2: '残酷',
                        HL_wufan_2_info: '移除一名其他角色的全部技能,直到你的回合结束',
                        HL_ziyu: '自愈',
                        HL_ziyu_info: '每五个任意回合后,你回复1点体力<br>你回复体力时,若此回复溢出,将之转变为护甲',
                        HL_ziyu_append: '<b style="color:rgba(230, 87, 21, 1); font-size: 15px;">治愈之炎,无论多么严重的伤势都能快速愈合</b>',
                        HL_kuangbao: '狂暴',
                        HL_kuangbao_info: '当你死亡前,若你处于狂暴状态则取消之<br>否则你进入狂暴状态,直至无伤害牌可出或任意敌方被你击杀<br>清除所有【严厉】/【残酷】标记,并发动一次对应效果<br>狂暴状态下,你只可使用伤害牌.每使用一张伤害牌,下一次造成的伤害翻倍<br>若有敌方被你击杀,你取消你的死亡结算,将体力至少回复至1',
                        HL_kuangbao_append: '<b style="color:rgba(230, 87, 21, 1); font-size: 15px;">来吧!我们还能继续厮杀!这是你所期盼的战斗!这是你所渴望的战争!</b>',
                        //————————————————————————————————————————————扑克
                        pukepai_duizi: '对子',
                        pukepai_duizi_info: '将两张同点数扑克对一名其他角色使用,目标须与使用者轮番打出两张更大的同点数扑克<br>直到某一方打出失败,此人受到1点伤害',
                        pukepai_zhadan: '炸弹',
                        pukepai_zhadan_info: '将四张同点数扑克对一名其他角色使用,对目标造成2点伤害',
                        pukepai_wangzha: '王炸',
                        pukepai_wangzha_info: '将大王小王对一名其他角色使用,对目标造成4点伤害,并且对目标相邻的角色造成一点伤害',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————太初弈无终·戒律    神      7/7
                        HL_jielv: '戒律',
                        HL_tianqi: '天启拈作劫',
                        HL_tianqi_info: '①每轮开始时,你从四项律法中选择获得其中两项律法(覆盖之前)<br>②敌方角色亵渎对应律法时,其所有技能失效,并获得持续2轮的对应律法的亵渎印记<br>③准备阶段,若敌方单个角色的亵渎印记种类数大于1,你进入『真理裁决』3轮',
                        HL_tianqi_append: '真理裁决<br><b style="color:rgba(231, 21, 214, 1)">你视为拥有全部律法,且律法增加强化效果<br>生命:你回复牌的回复量翻倍<br>智慧:摸牌阶段外,你摸牌数翻倍<br>战争:你伤害牌的伤害翻倍<br>威严:你使用牌时额外结算一次,重铸牌时摸一张牌</b><br>生命律法<br><b style="color:rgba(228, 213, 9, 1)">准备阶段和结束阶段,你回复7点体力值<br>你回复体力时,若回复值溢出,则摸溢出数量的牌,并增加等量上限</b><br>生命亵渎<br><b style="color:rgba(226, 18, 36, 1)">敌方角色回复量大于1时,视为亵渎生命律法<br>持有此印记时,无法使用回复牌,无法回复体力值</b><br>智慧律法<br><b style="color:rgba(228, 213, 9, 1)">准备阶段和结束阶段,你摸七张牌</b><br>智慧亵渎<br><b style="color:rgba(226, 18, 36, 1)">敌方角色于摸牌阶段外获得牌时,视为亵渎智慧律法<br>持有此印记时,无法使用或打出这些牌,且回合结束时弃置这些牌</b><br>战争律法<br><b style="color:rgba(228, 213, 9, 1)">你使用伤害牌后,摸造成伤害数张牌或回复等量体力值</b><br>战争亵渎<br><b style="color:rgba(226, 18, 36, 1)">敌方角色一回合内使用伤害牌数大于1时,视为亵渎战争律法<br>持有此印记时,防止造成的伤害.回合结束时,受到本回合造成伤害数的等量伤害</b><br>威严律法<br><b style="color:rgba(228, 213, 9, 1)">你成为牌的目标/受到伤害/失去体力时,你摸一张牌</b><br>威严亵渎<br><b style="color:rgba(226, 18, 36, 1)">敌方角色使用非回复牌指定你为目标时,视为亵渎威严律法<br>持有此印记时,无法指定你为目标.出牌阶段内使用非回复牌后,结束出牌阶段.回合结束时,翻面或跳过下个出牌阶段</b>',
                        _HL_zhenlicaijue: '真理裁决',
                        _HL_zhenlicaijue_info: '<b style="color:rgba(231, 21, 214, 1)">你视为拥有全部律法,且律法增加强化效果<br>生命:你回复牌的回复量翻倍<br>智慧:摸牌阶段外,你摸牌数翻倍<br>战争:你伤害牌的伤害翻倍<br>威严:你使用牌时额外结算一次,重铸牌时摸一张牌</b>',
                        HL_shengming: '生命律法',
                        _HL_shengming: '生命律法',
                        _HL_shengming_info: '<b style="color:rgba(228, 213, 9, 1)">准备阶段和结束阶段,你回复7点体力值<br>你回复体力时,若回复值溢出,则摸溢出数量的牌,并增加等量上限</b>',
                        xiedu_HL_shengming: '生命亵渎',
                        xiedu_HL_shengming_info: '<b style="color:rgba(226, 18, 36, 1)">敌方角色回复量大于1时,视为亵渎生命律法<br>持有此印记时,无法使用回复牌,无法回复体力值</b>',
                        HL_zhihui: '智慧律法',
                        _HL_zhihui: '智慧律法',
                        _HL_zhihui_info: '<b style="color:rgba(228, 213, 9, 1)">准备阶段和结束阶段,你摸七张牌</b>',
                        xiedu_HL_zhihui: '智慧亵渎',
                        xiedu_HL_zhihui_info: '<b style="color:rgba(226, 18, 36, 1)">敌方角色于摸牌阶段外获得牌时,视为亵渎智慧律法<br>持有此印记时,无法使用或打出这些牌,且回合结束时弃置这些牌</b>',
                        HL_zhanzheng: '战争律法',
                        _HL_zhanzheng: '战争律法',
                        _HL_zhanzheng_info: '<b style="color:rgba(228, 213, 9, 1)">你使用伤害牌后,摸造成伤害数张牌或回复等量体力值</b>',
                        xiedu_HL_zhanzheng: '战争亵渎',
                        xiedu_HL_zhanzheng_info: '<b style="color:rgba(226, 18, 36, 1)">敌方角色一回合内使用伤害牌数大于1时,视为亵渎战争律法<br>持有此印记时,防止造成的伤害.回合结束时,受到本回合造成伤害数的等量伤害</b>',
                        HL_weiyan: '威严律法',
                        _HL_weiyan: '威严律法',
                        _HL_weiyan_info: '<b style="color:rgba(228, 213, 9, 1)">你成为牌的目标/受到伤害/失去体力时,你摸一张牌</b>',
                        xiedu_HL_weiyan: '威严亵渎',
                        xiedu_HL_weiyan_info: '<b style="color:rgba(226, 18, 36, 1)">敌方角色使用非回复牌指定你为目标时,视为亵渎威严律法<br>持有此印记时,无法指定你为目标.出牌阶段内使用非回复牌后,结束出牌阶段.回合结束时,翻面或跳过下个出牌阶段</b>',
                        HL_wanshen: '万神镇诸天',
                        HL_wanshen_info: '你无视超出一点的伤害,终止你的判定',
                        HL_jieming: '劫命归一子',
                        HL_jieming_info: '当你对敌方角色造成伤害/成为敌方角色牌的目标后,你令其获得随机一个亵渎印记持续2轮【优先获得已持有律法所对应的亵渎印记】',
                        HL_wanlv: '一子定万律',
                        HL_wanlv_info: '每回合结束时,对该回合内获得过亵渎印记的敌方角色造成2点伤害.若其亵渎印记种类数大于1,则改为失去你持有律法数的体力值<br>若其失去的体力值小于你持有律法数,则重复此流程,直到其脱离濒死状态',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————残心
                        HL_canxin: '残心',
                        HL_liankui: '炼傀',
                        HL_liankui_info: '游戏开始时,你获得三个<傀><br>一名其他非傀儡角色首次受到伤害时,记录其一个技能并获得一个<傀><br>若其为主公,则不记录技能,改为获得四个<傀>,且本轮结束时,视作未对其发动过此技能<br>当你获得一个<傀>时,你增加一点体力上限,回复一点体力值并摸两张牌',
                        HL_xuansi: '悬丝',
                        HL_xuansi_info: '出牌阶段开始时/受到伤害后,你可以移除至多三个<傀>生成一个友方傀儡,赋予其x个已记录的技能(x为消耗的<傀>数)<br>所有角色会将傀儡视为队友,傀儡生命上限为3x,初始手牌为4x,傀儡至多三个',
                        HL_duoxing: '夺形',
                        HL_duoxing_info: '每轮开始时,你可以获得一个记录的技能直到此轮结束<br>当你体力值不大于0时,若场上有你的傀儡,令随机一个傀儡死亡,你将体力值回复至上限<br>当你的傀儡死亡后,你执行一个出牌阶段,若此傀儡体力上限大于5,你获得一个<傀>',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————傀儡
                        HL_kuilei: '傀儡',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————李白boss介绍
                        HL_libai_boss: '李白',
                        HL_libai_bossjieshao: '李白boss介绍',
                        HL_libai_bossjieshao_info: '此武将仅为boss展示用,其他模式均为白板<br>李白挑战模式<br>共四个阶段加一个隐藏阶段',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————李白通用技能
                        HL_libai1: '李白✬',
                        HL_baiyujing: '天上白玉京',
                        HL_baiyujing_info: '你只能受到实体牌的伤害',
                        HL_manhuying: '赵客缦胡缨',
                        HL_manhuying_info: '登场时,弃置敌方角色所有装备牌,并令其依次使用一张随机武器牌,其无法以除此之外的方式失去武器牌',
                        HL_shibusha: '十步杀一人',
                        HL_shibusha_info: '你每使用十张牌后,击杀一名敌方角色',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————一阶段
                        HL_wurenzhi: '无人知所去',
                        HL_wurenzhi_info: '全场每累计使用三张牌后,你进入无敌状态直到下个角色准备阶段',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————二阶段
                        HL_libai2: '李白✬✬',
                        HL_xujinhuan: '人生得意须尽欢',
                        HL_xujinhuan_info: '任意【酒】被使用后,你下一张伤害牌伤害+1<br>任意伤害牌被使用后,你摸等同于此牌伤害值张牌<br>任意角色进入濒死后,你结束当前回合',
                        HL_kongduiyue: '莫使金樽空对月',
                        HL_kongduiyue_info: '所有角色黑/红色手牌视作【酒】/【杀】',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————三阶段
                        HL_libai3: '李白✬✬✬',
                        HL_xinglunan: '行路难',
                        HL_xinglunan_info: '敌方角色每次使用技能后失去一点体力',
                        HL_duoqilu: '多歧路',
                        HL_duoqilu_info: '任意牌被使用时,令所有合法目标成为此牌目标',
                        HL_changfengpolang: '长风破浪会有时',
                        HL_changfengpolang_info: '任意多目标牌被使用后,你可以视作对其中任意一个目标使用x张【杀】(x为指定的目标数)',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————四阶段
                        HL_libai4: '李白✬✬✬✬',
                        HL_yirihuan: '千里江陵一日还',
                        HL_yirihuan_info: '你第三个回合开始时,重新开始三阶段',
                        HL_wanguchou: '与尔同销万古愁',
                        HL_wanguchou_info: '敌方角色使用牌指定目标时,改为从所有合法目标里随机选择一个',
                        HL_penghaoren: '我辈岂是蓬蒿人',
                        HL_penghaoren_info: '你体力值减少后,随机使用牌堆与弃牌堆各一张可使用的牌',
                        HL_penghaoren_append: '————此技能失去时,将武将牌替换为碎月✬李白',
                        HL_kaixinyan: '使我不得开心颜',
                        HL_kaixinyan_info: '敌方角色使用♠️️牌后,其失去一点体力;敌方角色使用♥️️牌时,你回复一点体力',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————邵
                        HL_shao: '邵',
                        HL_xingxingzhihuo: '星星之火',
                        HL_xingxingzhihuo_info: '当你失去最后的手牌时,将你的手牌补充为四',
                        HL_kangkaijiang: '慷慨激昂',
                        HL_kangkaijiang_info: '每当你使用(指定目标后)或被使用(成为目标后)【决斗】或【杀】时或每当你使用或打出【闪】时,你从牌堆或弃牌堆中摸一张【杀】与【闪】.',
                        HL_yelongliezhan: '烨龙烈斩',
                        HL_yelongliezhan_info: '你的红色【杀】视为无次数限制的火属性【杀】;当你造成火属性伤害后,目标角色获得一枚『烧伤』标记,你弃置一张牌.',
                        HL_pulaomingzhong: '蒲牢鸣钟',
                        HL_pulaomingzhong_info: '①当你弃置牌后,你令场上所有敌方角色弃置一张牌;当任意角色弃置牌后,其获得一枚烧伤标记;②体力流失对你无效;③当你的手牌数大于20后,你将手牌弃置20张.',
                        HL_gongfubishui: '蚣蝮避水',
                        HL_gongfubishui_info: '当你受到伤害时,若此伤害为火属性,则此伤害对你无效;若此伤害不为冰属性,则此伤害减一,你回复一点体力值(若你的体力值已达上限,则改为你获得一点护甲值)',
                        HL_shaoEGO: '邵E·G·O',
                        HL_shaoEGO_info: '你每使用或打出一张牌/造成一次伤害,获得一枚/三枚『情感』标记(上限为15);你每拥有三枚此标记,你使用杀的次数+1.',
                        HL_shaoEGO_1: '邵E·G·O',
                        HL_shaoEGO_1_info: '任意角色的回合开始或结束,若情感标记大于12,获得以下技能',
                        HL_shaoEGO_1_append: '椒图镇邪<br>当你成为敌方角色使用牌的目标时,若此牌有点数且为实体牌:(你与其使用的牌拼点,若你赢,令此牌无效,令其获得三枚烧伤标记).否则令此牌无效<br>狴犴争讼<br>敌方角色的回合开始时,令拥有烧伤标记的敌方角色受到x点伤害(x为其烧伤标记数量),你回复等量体力(若体力已达到上限,则改为获得等量护甲)<br>螭吻吞脊<br>当你成为敌方角色使用牌的目标时,进行一次判定,若判定牌不为黑色,你令其流失一点体力,否则你流失一点体力<br>睚眦雪恨<br>当你使用牌指定敌方角色成为目标时,进行一次判定,若判定牌的点数与你的体力上限不同,令其获得两枚烧伤标记<br>狻猊腾云<br>你的回合开始或回合结束时,若场上敌方角色拥有烧伤标记,令其受到六次x点伤害(x为场上烧伤标记数量×你的情感标记数)<br>饕餮饗食<br>当你受到伤害时,你弃置一张牌,令此伤害减x(x为场上烧伤标记数量);当你流失体力时,令其无效,你增加一点体力上限<br>赑屃负礎<br>当你造成伤害时,令此伤害加X(X为场上的烧伤标记数量);当你拼点时,点数加X',
                        HL_jiaotu: '椒图镇邪',
                        HL_jiaotu_info: '当你成为敌方角色使用牌的目标时,若此牌有点数且为实体牌:(你与其使用的牌拼点,若你赢,令此牌无效,令其获得三枚烧伤标记).否则令此牌无效',
                        HL_bian: '狴犴争讼',
                        HL_bian_info: '敌方角色的回合开始时,令拥有烧伤标记的敌方角色受到x点伤害(x为其烧伤标记数量),你回复等量体力(若体力已达到上限,则改为获得等量护甲)',
                        HL_liwen: '螭吻吞脊',
                        HL_liwen_info: '当你成为敌方角色使用牌的目标时,进行一次判定,若判定牌不为黑色,你令其流失一点体力,否则你流失一点体力',
                        HL_yazi: '睚眦雪恨',
                        HL_yazi_info: '当你使用牌指定敌方角色成为目标时,进行一次判定,若判定牌的点数与你的体力上限不同,令其获得两枚烧伤标记',
                        HL_suoni: '狻猊腾云',
                        HL_suoni_info: '你的回合开始或回合结束时,若场上敌方角色拥有烧伤标记,令其受到六次x点伤害(x为场上烧伤标记数量×你的情感标记数)',
                        HL_taotie: '饕餮饗食',
                        HL_taotie_info: '当你受到伤害时,你弃置一张牌,令此伤害减x(x为场上烧伤标记数量);当你流失体力时,令其无效,你增加一点体力上限',
                        HL_bili: '赑屃负礎',
                        HL_bili_info: '当你造成伤害时,令此伤害加X(X为场上的烧伤标记数量);当你拼点时,点数加X',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————至高烈阳
                        HL_zhigaolieyang: '至高烈阳',
                        HL_A_zhi: '止✬长昼月之息',
                        HL_A_zhi_info: '你始终拥有1限伤,每当你触发限伤后获得一个<止>,你可以弃置一枚<止>终止一个敌方角色技能的发动',
                        HL_A_luo: '落✬机缘月之光',
                        HL_A_luo_info: '当有角色不因击杀你而获得胜利时,取消之并斩杀该角色<br>体力上限或体力值低于3的敌方角色,所有技能失效',
                        HL_A_ji: '击✬三千里之火',
                        HL_A_ji_info: '游戏开始时,将场地天气切换为<烈阳>.任意火属性伤害被造成时,将你场地天气切换为<烈阳>',
                        _HL_lieyang: '烈阳',
                        _HL_lieyang_info: '此天气下,火属性伤害翻倍<br>每次火属性伤害会增加环境温度<br>任意出牌阶段开始时,根据当前温度点燃其随机数量手牌称为<燃><br><燃>造成的伤害视为火属性,被<燃>指定的目标根据温度受到随机火属性伤害<br>任意回合结束后,若当前角色牌中有<燃>,焚毁这些牌并对其造成等量火属性伤害',
                        HL_A_heng: '烜✬若垂天之云',
                        HL_A_heng_info: '每轮开始时/准备阶段,你视为对所有敌方角色使用一张【火烧连营】',
                        HL_A_nu: '怒✬焚晨昏日星',
                        HL_A_nu_info: '蓄力技(0/9),每受到/造成1点火焰伤害后获得1点蓄力值<br>当蓄力值达到上限时,消耗所有蓄力值,令所有敌方角色受到1～2点火焰伤害并弃置等量手牌',
                        HL_A_zhuan: '抟✬九万里之炎',
                        HL_A_zhuan_info: '觉醒技,体力值低于一半时,你将武将牌替换为【至怒狂雷】',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————至怒狂雷
                        HL_zhinukuanglei: '至怒狂雷',
                        HL_A_ming: '鸣✬三千里之雷',
                        HL_A_ming_info: '任意<雷>/<水>属性伤害被造成时,将场地天气切换为<雷电>/<暴雨>.你登场时,为牌堆中随机加入二十分之一的<水弹>',
                        _HL_leidian: '雷电',
                        _HL_leidian_info: '此天气下,雷属性伤害翻倍<br>所有黑桃牌均视为雷属性<br>任意牌被使用或打出时,当前角色进行一次闪电判定',
                        _HL_baoyu: '暴雨',
                        _HL_baoyu_info: '此天气下,水属性伤害翻倍<br>任意回合开始时,将场上所有装备牌变化为<水弹><br>每回合至多使用5-<水弹>数张牌',
                        g_shuidan: '水弹',
                        g_shuidan_info: '回合限一次,你可以将一枚<水弹>转移给其他角色,不因此而失去<水弹>时,受到一点水属性伤害',
                        HL_A_ting: '霆✬如海摇山倾',
                        HL_A_ting_info: '每轮开始时/准备阶段,你视为对所有敌方角色使用一张【水淹七军】',
                        HL_A_fen: '愤✬破昼夜长空',
                        HL_A_fen_info: '蓄力技(0/9),每受到/造成1点雷电伤害后获得1点蓄力值<br>当蓄力值达到上限时,消耗所有蓄力值,令所有敌方角色受到1～2点雷电伤害并弃置等量手牌',
                        HL_A_ce: '策✬九万里之电',
                        HL_A_ce_info: '觉醒技,当你体力值不大于0时,将武将牌更换为【绝灭者】,并进行一个额外回合',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————绝灭者
                        HL_juemiezhe: '绝灭者',
                        HL_zhianchaoxi: '自✬灰烬彼岸',
                        HL_zhianchaoxi_info: '游戏开始时,全场角色获得技能<虹彩><br>每轮开始时或准备阶段,你令所有敌方角色选择一项:1,失去2点体力值;2,减少1点体力上限<br>任意敌方角色体力上限与体力值均为1时斩杀该角色',
                        HL_hongcai: '虹彩',
                        HL_hongcai_info: '出牌阶段限一次,你可以弃置两张牌复原武将牌,增加3点体力上限,回复3点体力值,摸七张牌,本回合造成的伤害翻倍,获得所有场地天气效果',
                        HL_zhangbujimoyan: '张✬怖寂魔眼',
                        HL_zhangbujimoyan_info: '每轮开始时或准备阶段,视为你对所有敌方角色使用一张【水淹七军】和【火烧连营】',
                        HL_jinhuisiji: '落✬灭死残星',
                        HL_jinhuisiji_info: '蓄力技(0/18),每受到/造成1点火焰或雷电伤害后获得1点蓄力值<br>当蓄力值达到上限时,消耗所有蓄力值,对所有敌方角色造成1点火焰伤害,1点雷电伤害,受伤角色各失去1点体力值,减少1点体力上限并弃置已损失体力值数牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————丰乐亭侯  神  120体力
                        HL_fengletinghou: '丰乐亭侯',
                        HL_pozhu: '破竹',
                        HL_pozhu_info: '每阶段每种牌名限一次,你可以将一张牌当做任意牌使用,摸一张牌',
                        HL_jingxie: '精械',
                        HL_jingxie_info: '准备阶段,你随机使用每种类型强化装备各一张;从牌堆/弃牌堆中随机获得2基本3锦囊',
                        HL_qianxun: '谦逊',
                        HL_qianxun_info: '其他角色使用的锦囊牌对你无效,你每回合首次受到伤害时,防止之,摸两张牌',
                        HL_dingli: '定历',
                        HL_dingli_info: '每名角色准备阶段,你卜算x(x为该角色座次数);免疫王受到的伤害;你退场后,王召唤的士兵生命值翻倍,对敌方角色造成的伤害翻倍',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————凡人之愿  群  3体力
                        HL_fanren: '凡人之愿',
                        HL_fanyuan: '凡愿',
                        HL_fanyuan_info: '体力减少时,进行一次判定;若不为♥️️,防止之',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————国之柱石  神  200体力
                        HL_zhushi: '国之柱石',
                        HL_zhenguo: '镇国',
                        HL_zhenguo_info: '王对敌方角色造成伤害时,此伤害翻倍',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————兴国志士  神  4体力
                        HL_zhishi: '兴国志士',
                        HL_tuxing: '图兴',
                        HL_tuxing_info: '每回合限一次,你使用锦囊牌时,所有友方角色各摸一张牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————铁骨铮臣  神  24体力
                        HL_zhengchen: '铁骨铮臣',
                        HL_zhenggu: '铮骨',
                        HL_zhenggu_info: '受到伤害/体力流失/体力调整时,改为失去一点体力',
                        HL_qieyan: '切言',
                        HL_qieyan_info: '准备阶段,你随机展示三张普通锦囊牌,并令王选择其中一张使用之;若王拒绝使用,你失去一点体力',
                        HL_quan: '祛暗',
                        HL_quan_info: '王的回合结束时,你弃置所有敌方角色各一张牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者骁勇  神  6体力(刀/枪/弓随机之一)
                        HL_xiaoyong1: '王者骁勇',
                        HL_xiaoyong2: '王者骁勇',
                        HL_xiaoyong3: '王者骁勇',
                        HL_jindao: '金刀',
                        HL_jindao_info: '你使用伤害牌指定敌方角色时,将其所有牌移出游戏直到此回合结束,你对牌数小于你的敌方角色造成的伤害翻倍',
                        HL_jinqiang: '金枪',
                        HL_jinqiang_info: '你使用或打出【杀】/【闪】时,获得对方一张牌,你可以将一张基本牌当做【杀】/【闪】使用或打出',
                        HL_jingong: '金弓',
                        HL_jingong_info: '你使用【杀】指定敌方角色时,你本回合每使用过一个花色的牌,此【杀】伤害+1',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者御卫  神  30体力
                        HL_yuwei: '王者御卫',
                        HL_fushi: '拂士',
                        HL_fushi_info: '免疫王受到的伤害;造成伤害时,令王回复等量体力',
                        HL_zhene: '镇恶',
                        HL_zhene_info: '敌方角色结束阶段,若其本回合造成了伤害,你视作对其使用一张【杀】,期间其技能失效',
                        HL_mengguang: '蒙光',
                        HL_mengguang_info: '王的出牌阶段结束后,回复一点体力',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————封印之王座  神  500.0体力
                        HL_wangzuo: '封印之王座',
                        HL_shengzhe: '圣者荣光',
                        HL_shengzhe_info: '你始终拥有90%减伤和50限伤;体力值低于10%时,你召唤丰乐亭侯',
                        HL_wangdao: '王道权御',
                        HL_wangdao_info: '每轮开始时,若场上没有士兵,随机召唤一批次士兵<br>若场上有士兵,令所有士兵自爆<br>每自爆一个士兵的一点体力,对随机敌方单位造成1点伤害<br>批次1<br>王左右出现王者御卫,玩家两侧出现王者骁勇<br>批次2<br>王左右出现铁骨铮臣,玩家两侧出现兴国志士<br>批次3<br>王左右出现国之柱石<br>批次4<br>玩家两侧出现两个凡人之愿',
                        HL_tongxin: '勠力同心',
                        HL_tongxin_info: '你回合结束后,令所有士兵依次执行一个回合<br>士兵回合结束后,令你执行一个额外的摸牌阶段与出牌阶段',
                        //————————————————————————————————————————————博卓卡斯替·圣卫铳骑
                        HL_shengwei: '博卓卡斯替·圣卫铳骑',
                        HL_quanyu: '劝谕',
                        HL_quanyu_info: '敌方角色使用伤害牌时只能指定你为目标,且其进入濒死状态时需额外使用一张回复类实体牌',
                        HL_zhaohu: '照护',
                        HL_zhaohu_info: '受到与你距离为2及其以上的敌方角色的伤害至多为1;敌方角色受到你造成的伤害之后直到下回合之前其造成和受到的伤害+1',
                        //————————————————————————————————————————————奎隆·魔诃萨埵权化
                        HL_kuilong: '奎隆·魔诃萨埵权化',
                        HL_chengjie: '惩戒',
                        HL_chengjie_info: '当你使用负收益牌指定敌方角色时,该牌额外结算四次',
                        //————————————————————————————————————————————特雷西斯·黑冠尊主
                        HL_heiguanzunzhu: '特雷西斯·黑冠尊主',
                        HL_zhengfu: '征服',
                        HL_zhengfu_info: '你视为拥有技能【无双】,【铁骑】,【破军】,【强袭】',
                        //————————————————————————————————————————————曼弗雷德
                        HL_manfuleide: '曼弗雷德',
                        HL_junshixunlian: '军事训练',
                        HL_junshixunlian_info: '①你视为装备【先天八卦阵】<br>②造成伤害时有50%替换为随机属性伤害<br>③你受到【杀】的伤害后此技能失效直到本轮结束',
                        //————————————————————————————————————————————阿米娅·炉芯终曲 血量:1000/1000 势力:神
                        HL_amiya: '阿米娅·炉芯终曲',
                        HL_buyingcunzai: '不应存在之人',
                        HL_buyingcunzai_info: '①你始终拥有50%减伤<br>②当血量低于50%时,获得无敌状态【当体力值减少时防止之】直到本轮结束',
                        HL_chuangyi: '仅剩的创意',
                        HL_chuangyi_info: '①游戏开始时你获得3枚<仅剩的创意>,将场上所有角色势力锁定为<神>,并令敌方角色获得<束缚>状态,直到你造成伤害<br>②每轮开始/造成伤害/体力变化后,你获得等量的<仅剩的创意>并摸等量的牌<br>③你的手牌上限等于<仅剩的创意>数<br>④准备阶段,你消耗3枚<仅剩的创意>对敌方角色各造成1点伤害',
                        HL_jintouchongxian: '尽头重现',
                        HL_jintouchongxian_info: '准备阶段若你<仅剩的创意>达到30枚以上,消耗30枚<仅剩的创意>随机召唤一位随从加入战斗,每名随从限一次.随从除武将牌上技能外皆视为拥有<贵乱>',
                        HL_guiluan: '贵乱',
                        HL_guiluan_info: '当你使用【杀】、【决斗】、【过河拆桥】、【顺手牵羊】和【逐近弃远】时,若场上有未成为目标的敌方角色,你令这些角色也成为此牌目标',
                        HL_cunxuxianzhao: '存续先兆',
                        HL_cunxuxianzhao_info: '蓄力技(0/10),结束阶段,若蓄力值已满消耗所有蓄力值随机令一名敌方角色所有技能失效并死亡.每名随从死亡时增加五点蓄力值',
                        HL_wuzhong: '无终',
                        HL_wuzhong_info: '觉醒技,当你体力值不大于0时将体力值回复至上限,获得技能【黑冠余威】,【无言的期盼】和【永恒存续】,重置技能【不应存在之人】',
                        HL_heiguan: '黑冠余威',
                        HL_heiguan_info: '①当体力值首次回复至上限后立即令敌方角色失去一半体力值<br>②每次消耗<仅剩的创意>时伤害+X(X为1~7的随机值,存活的角色越多此伤害随机加成越低)',
                        HL_qipan: '无言的期盼',
                        HL_qipan_info: '结束阶段开始时,若场上有其他角色的手牌数大于/小于你,则令所有其他角色将手牌数弃置/摸至与你相等',
                        HL_yongheng: '永恒存续',
                        HL_yongheng_info: '限定技,当你死亡前,<br>若你为BOSS,令所有其他角色死亡,视盟军胜利<br>否则令所有其他角色失去所有体力值,你回复等量体力并摸等量的牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————李白
                        HL_李白: '碎月✬李白',
                        醉诗: '醉诗',
                        醉诗_info: '每回合限两次,每轮开始/体力变化后,你视为使用一张<酒>并随机使用牌堆中一张伤害牌,你随机使用弃牌堆或处理区中一张伤害牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————许劭
                        HL_许劭: '许劭',
                        HL_pingjian: '评鉴',
                        HL_pingjian_info: '在很多时机,你都可以尝试运行一个对应时机技能的content',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————神之無雙
                        HL_ws_boss: '神之無雙',
                        HL_ws_bossjieshao: '神之無雙boss介绍',
                        HL_ws_bossjieshao_info: '此武将仅为boss展示用,其他模式均为白板<br>神之無雙挑战模式<br>1.此模式有四个boss(無雙飞将/镇关魔将/焚城魔士/乱武毒士),每阶段抽取阶段数的boss登场,且boss按阶段解锁技能<br>2.boss体力值大于0时拒绝死亡,免疫除受伤害外扣减体力值,免疫翻面横置与移除,免疫扣减体力上限',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————無雙飞将
                        HL_lvbu: '無雙飞将',
                        HL_wushuang: '無雙',
                        HL_wushuang_info: '登场时,视作依次使用四张【杀】.你使用【杀】指定敌方角色时,令其武将牌上的技能失效<br>你的【杀】需要x张【闪】来响应,基础伤害提高x点,可以额外指定至多x个目标(x为敌方角色数)',
                        HL_wumou: '无谋',
                        HL_wumou_info: '二阶段解锁,你使用的除【决斗】以外的锦囊牌失效,使用的基本牌结算三次',
                        HL_jiwu: '极武',
                        HL_jiwu_info: '三阶段解锁,你使用伤害牌指定目标后,令这些角色各失去一点体力',
                        HL_liyu: '利驭',
                        HL_liyu_info: '四阶段解锁,每名角色回合限一次,你使用伤害牌指定其后,摸四张牌,出牌阶段出杀次数+1,防止此牌对其造成的伤害,你下一次造成的伤害翻倍',
                        HL_shenwei: '神威',
                        HL_shenwei_info: '炼狱模式解锁,其他角色准备阶段,你获得一张【杀】并可以使用之',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————镇关魔将
                        HL_huaxiong: '镇关魔将',
                        HL_yaowu: '耀武',
                        HL_yaowu_info: '登场时,展示所有敌方角色的手牌并弃置其中的伤害牌.敌方角色使用伤害牌时,你取消所有目标,令此牌对你结算x次(x为此牌指定的目标数)',
                        HL_shiyong: '恃勇',
                        HL_shiyong_info: '二阶段解锁,当你受到伤害后,你摸一张牌,可以将一张牌当做【杀】对伤害来源使用,若此【杀】造成了伤害,你弃置其一张牌',
                        HL_shizhan: '势斩',
                        HL_shizhan_info: '三阶段解锁,敌方角色准备阶段,你摸三张牌,其视作依次对你使用两张【决斗】,你可以将一张黑色牌当做【杀】打出',
                        HL_yangwei: '扬威',
                        HL_yangwei_info: '四阶段解锁,敌方角色出牌阶段开始时,其需选择一项:①本回合使用基本牌②本回合使用非基本牌.其执行另外一项后,你对其造成一点伤害',
                        HL_zhenguan: '镇关',
                        HL_zhenguan_info: '炼狱模式解锁,当你成为一张基本牌或普通锦囊牌的目标时,你进行一次判定,若为黑色,此牌对你无效',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————抗性测试
                        HL_kangxing: '抗性测试',
                        HL_miaosha: '秒杀',
                        HL_miaosha_info: '清空对方技能并进行即死',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————焚城魔士
                        HL_liru: '焚城魔士',
                        HL_fencheng: '焚城',
                        HL_fencheng_info: '登场时,对所有敌方角色各造成三点火焰伤害.准备阶段,连续进行四次判定,对所有敌方角色造成相当于判定结果中♥️️️牌数点火焰伤害',
                        HL_juece: '绝策',
                        HL_juece_info: '二阶段解锁,每名角色结束阶段,你令所有此回合失去过牌的角色各失去一点体力',
                        HL_mieji: '灭计',
                        HL_mieji_info: '三阶段解锁,准备阶段,你展示一名敌方角色的手牌,弃置里面所有基本牌,获得其中所有锦囊牌',
                        HL_zhendi: '鸩帝',
                        HL_zhendi_info: '四阶段解锁,其他角色准备阶段,你将一张【毒】从游戏外加入于其手牌中,有【毒】进入弃牌堆时,你下一次造成的伤害+1',
                        HL_dujiu: '毒酒',
                        HL_dujiu_info: '炼狱模式解锁,游戏开始时,你将牌堆里所有【酒】替换为【毒】,将12张【毒】加入游戏,我方角色使用【毒】时,改为回复两点体力',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————乱武毒士
                        HL_jiaxu: '乱武毒士',
                        HL_luanwu: '乱武',
                        HL_luanwu_info: '登场时,为所有敌方角色附加三层<重伤>效果(重伤:回复体力时,将回复值设定为0并移除一层<重伤>)<br>乱武:准备阶段,你令所有敌方角色依次选择一项:①本回合无法使用【桃】,失去一点体力②对一名友方角色使用一张【杀】.选择结束后,你摸相当于选择①角色数量张牌,视作依次使用选择②角色数量张【杀】',
                        HL_wansha: '完杀',
                        HL_wansha_info: '二阶段解锁,你的回合内,敌方角色回复体力后,若其不处于濒死状态,你令其失去一点体力,若其仍处于濒死状态,你令其获得一层<重伤>',
                        HL_weimu: '帷幕',
                        HL_weimu_info: '三阶段解锁,我方角色始终拥有1限伤,且每回合至多受到5次伤害',
                        HL_chengxiong: '惩雄',
                        HL_chengxiong_info: '四阶段解锁,敌方角色使用于其摸牌阶段外获得的牌时,失去一点体力',
                        HL_duji: '毒计',
                        HL_duji_info: '炼狱模式解锁,任意角色使用普通锦囊牌时,你进行一次判定,若为黑色,其失去一点体力,若为红色,你令一名角色回复一点体力',
                    },
                };
                for (const i in QQQ.character) {
                    const info = QQQ.character[i];
                    if (!info.hp) {
                        info.hp = 4;
                    }
                    if (!info.maxHp) {
                        info.maxHp = 4;
                    }
                    if (info.isBoss) {
                        HL.boss.push(i);
                    }
                    info.group = '仙';
                    info.isZhugong = true;
                    if (!info.trashBin) {
                        info.trashBin = [`ext:火灵月影/image/${i}.jpg`];
                    }
                    if (!info.dieAudios) {
                        info.dieAudios = [`ext:火灵月影/audio/${i}.mp3`];
                    }
                }
                for (const i in QQQ.skill) {
                    const info = QQQ.skill[i];
                    info.nobracket = true;
                    const trans = QQQ.translate[`${i}_info`];
                    if (info.forced && trans) {
                        QQQ.translate[`${i}_info`] = `<span class=Qmenu>锁定技,</span>${trans}`;
                    }
                    if (!info.audio) {
                        info.audio = 'ext:火灵月影/audio:2';
                    }
                    if (info.subSkill) {
                        for (const x in info.subSkill) {
                            const infox = info.subSkill[x];
                            if (!infox.audio) {
                                infox.audio = 'ext:火灵月影/audio:2';
                            } //如果是choosebutton,语音应该是xxx_backup
                        }
                    }
                } //QQQ
                lib.config.all.characters.add('火灵月影');
                lib.config.characters.add('火灵月影');
                lib.translate['火灵月影_character_config'] = `火灵月影`;
                return QQQ;
            });
            game.import('card', function (lib, game, ui, get, ai, _status) {
                const QQQ = {
                    name: '火灵月影',
                    connect: true,
                    card: {
                        shuidan: {
                            type: 'basic',
                            enable: true,
                            usable: 1,
                            filterTarget(card, player, target) {
                                return target != player;
                            },
                            selectTarget: 1,
                            discard: false,
                            lose: false,
                            async content(event, trigger, player) {
                                if (event.cards?.length) {
                                    player.give(event.cards, event.target);
                                }
                            },
                            ai: {
                                basic: {
                                    useful: -1,
                                    value: -1,
                                },
                                order: 10,
                                result: {
                                    target: -2,
                                },
                            },
                            global: ['g_shuidan'],
                        },
                        // 回合限一次,将一张扑克对一名其他角色使用,目标须与使用者轮番打出一张更大的扑克
                        // 直到某一方打出失败,此人受到1点伤害
                        pukepai: {
                            fullskin: true,
                            type: 'pukepai',
                            enable: true,
                            usable: 1,
                            filterTarget(card, player, target) {
                                return target != player;
                            },
                            selectTarget: 1,
                            async content(event, trigger, player) {
                                let num = event.card.number;
                                const players = [event.target, player];
                                let index = 0;
                                while (true) {
                                    const npc = players[index];
                                    const { result } = await npc.chooseToRespond('打出一张更大的扑克,否则受到1点伤害', (c) => c.name == 'pukepai' && c.number > num);
                                    if (result?.cards?.length) {
                                        index = (index + 1) % 2;
                                        num = result.cards[0].number;
                                    } else {
                                        npc.damage();
                                        break;
                                    }
                                }
                            },
                            ai: {
                                order: 10,
                                result: {
                                    target: -2,
                                },
                                tag: {
                                    damage: 1,
                                },
                                basic: {
                                    useful: 1,
                                    value: 5,
                                },
                            },
                            global: ['pukepai_duizi', 'pukepai_zhadan', 'pukepai_wangzha'],
                        },
                        // 乐极生悲
                        // 出牌阶段对自己使用,目标摸2张牌,将全场添加<乐极生悲>领域直到目标下个回合开始时或死亡
                        lejishengbei: {
                            audio: 'ext:火灵月影/audio:1',
                            type: 'trick',
                            enable: true,
                            filterTarget(card, player, target) {
                                return target == player;
                            },
                            selectTarget: -1,
                            async content(event, trigger, player) {
                                event.target.draw(2);
                                game.addGlobalSkill('g_lejishengbei');
                                game.addGlobalSkill('g_lejishengbei_1');
                                HL.lejishengbei = event.target;
                            },
                            ai: {
                                order: 10,
                                result: {
                                    target: 2,
                                },
                                basic: {
                                    useful: 1,
                                    value: 5,
                                },
                            },
                        },
                    },
                    translate: {
                        shuidan: '水弹',
                        shuidan_info: '回合限一次,你可以将一枚<水弹>转移给其他角色,不因此而失去<水弹>时,受到一点水属性伤害',
                        pukepai: '扑克',
                        pukepai_info: '回合限一次,将一张扑克对一名其他角色使用,目标须与使用者轮番打出一张更大的扑克<br>直到某一方打出失败,此人受到1点伤害<br>对子<br>将两张同点数扑克对一名其他角色使用,目标须与使用者轮番打出两张更大的同点数扑克<br>直到某一方打出失败,此人受到1点伤害<br>炸弹<br>将四张同点数扑克对一名其他角色使用,对目标造成2点伤害<br>王炸<br>将大王小王对一名其他角色使用,对目标造成4点伤害,并且对目标相邻的角色造成一点伤害',
                        lejishengbei: '乐极生悲',
                        lejishengbei_info: '出牌阶段对自己使用,目标摸2张牌,将全场添加<乐极生悲>领域直到目标下个回合开始时或死亡',
                    },
                };
                for (const i in QQQ.card) {
                    const info = QQQ.card[i];
                    if (!info.audio) {
                        info.audio = 'ext:火灵月影/audio:2';
                    }
                    info.modTarget = true;
                    info.equipDelay = false;
                    info.loseDelay = false;
                    if (info.enable == undefined) {
                        info.enable = true;
                    }
                    if (info.type == 'equip') {
                        info.toself = true;
                        info.filterTarget = function (card, player, target) {
                            return player == target && target.canEquip(card, true);
                        };
                        info.selectTarget = -1;
                        info.ai.basic = {
                            equipValue: info.ai.equipValue,
                            useful: 0.1,
                            value: info.ai.equipValue,
                            order: info.ai.equipValue,
                        };
                        info.content = async function (event, trigger, player) {
                            if (event.cards.length) {
                                event.target.equip(event.cards[0]);
                            }
                        };
                        info.ai.result = {
                            target: (player, target, card) => get.equipResult(player, target, card),
                        };
                    }
                    info.image = `ext:火灵月影/image/${i}.jpg`;
                    lib.inpile.add(i);
                    if (info.mode && !info.mode.includes(lib.config.mode)) continue;
                    lib.card.list.push([lib.suits.randomGet(), lib.number.randomGet(), i]);
                }
                lib.config.all.cards.add('火灵月影');
                lib.config.cards.add('火灵月影');
                lib.translate.火灵月影_card_config = '火灵月影';
                return QQQ;
            });
        },
        config: {
            群聊: {
                name: '<a href="https://qm.qq.com/q/SsTlU9gc24"><span class=Qmenu>【火灵月影】群聊: 771901025</span></a>',
                clear: true,
            },
            斩杀测试: {
                name: '<span class=Qmenu>斩杀测试</span>',
                intro: '斩尽世间一切敌',
                init: false,
            },
            lianyu: {
                name: '<span class=Qmenu>挑战炼狱模式</span>',
                intro: '开启后,神之無雙增加技能',
                init: true,
            },
            死亡移除: {
                name: '<span class=Qmenu>死亡移除</span>',
                intro: '死亡后移出游戏',
                init: true,
                onclick(result) {
                    game.saveConfig('dieremove', result);
                },
            },
            文字闪烁: {
                name: '<span class=Qmenu>文字闪烁</span>',
                intro: '开启后,部分文字会附加闪烁动画效果',
                init: true,
            },
            扑克模式: {
                name: '<span class=Qmenu>扑克模式</span>',
                intro: '开启后,将牌堆改为54张扑克',
                init: false,
            },
            关闭本体BOSS: {
                name: '<span class=Qmenu>关闭本体BOSS</span>',
                intro: '一键关闭本体BOSS',
                init: true,
            },
            武将全部可选: {
                name: '<span class=Qmenu>武将全部可选</span>',
                intro: '开启后,任何禁将、隐藏武将、BOSS武将都会变得可选,你甚至可以在BOSS模式用BOSS自己打自己',
                init: true,
            },
        },
        package: extensionInfo,
    };
});
