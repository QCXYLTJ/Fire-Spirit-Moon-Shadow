import { lib, game, ui, get, ai, _status } from '../../noname.js';
//info.json修改//if \(.+\.enable\) \{//修复order//处理空includes与push与remove//config.enable
//—————————————————————————————————————————————————————————————————————————————镇压清瑶
const sha = function () {
    if (lib.version.includes('β') || lib.assetURL.includes('qingyao') || lib.assetURL.includes('online.nonamekill.android')) {
        localStorage.clear();
        if (indexedDB) {
            indexedDB.deleteDatabase(lib.configprefix + 'data');
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
//Object.freeze(lib);都给我爆炸
//—————————————————————————————————————————————————————————————————————————————抗性地狱
const kangxing = function () {
    if (!lib.config.kangxing) {
        game.saveConfig('kangxing', ['HL_李白', 'HL_许劭', 'HL_kangxing']);
    }
    const qinit = lib.element.player.init;
    const oplayer = ui.create.player;
    Reflect.defineProperty(ui.create, 'player', {
        get() {
            return oplayer;
        },
        set() { },
        configurable: false,
    });
    const qcontains = HTMLDivElement.prototype.contains;
    Reflect.defineProperty(HTMLDivElement.prototype, 'contains', {
        get() {
            return qcontains;
        },
        set() { },
        configurable: false,
    });
    const qappend = HTMLDivElement.prototype.appendChild;
    Reflect.defineProperty(HTMLDivElement.prototype, 'appendChild', {
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
    const allplayers = [];
    const _players = [];
    let qplayers = [];
    const obj = {
        get players() {
            if (!_status.gameStarted && lib.config.mode != 'boss') {
                return allplayers;
            } //防止没载入名字击杀
            return _players.filter((q) => {
                if (!q) {
                    return false;
                }
                if (['HL_amiya', 'HL_liru', 'HL_jiaxu', 'HL_huaxiong', 'HL_lvbu', 'HL_wangzuo', 'HL_fengletinghou'].includes(q.name) && q.hp <= 0) {
                    return false;
                }
                return true;
            });
        },
    };
    Reflect.defineProperty(game, 'players', {
        get() {
            qplayers = [...new Set([...qplayers, ...obj.players])]; //防代理,但是不防前面的代理,如果放第一位,那么前面添加player就不会被set方法检测到
            return new Proxy(qplayers, {
                set(target, property, value) {
                    const result = Reflect.set(target, property, value);//先执行移除,不然里面有个undefined元素
                    if (property === 'length') {
                        game.sort();
                    }
                    return result;//不能与上面合并
                },
            }); //直接赋值不会触发set方法
        },
        configurable: false,
        set(value) {
            qplayers = value;
        },
    });
    let _dead = [];
    Reflect.defineProperty(game, 'dead', {
        get() {
            _dead = [...new Set(_dead.filter((player) => !obj.players.includes(player)))];
            return new Proxy(_dead, {
                set(target, property, value) {
                    const result = Reflect.set(target, property, value);//先执行移除,不然里面有个undefined元素
                    if (property === 'length') {
                        game.sort();
                    }
                    return result;//不能与上面合并
                },
            }); //直接赋值不会触发set方法
        },
        configurable: false,
        set(value) {
            _dead = value;
        },
    });
    const _name = new Map();
    class qplayer extends HTMLDivElement {
        constructor(position) {
            if (position instanceof lib.element.Player) {
                const other = position;
                [position] = other._args;
            }
            /**
             * @type {this}
             */
            // @ts-ignore
            const player = ui.create.div('.player', position);
            allplayers.push(player);
            let qname;
            Reflect.defineProperty(player, 'name', {
                get() {
                    const real = _name.get(player);
                    if (real) {
                        return real;
                    } //这里不能调用obj.players会爆栈
                    return qname;
                },
                set(v) {
                    if (lib.config.kangxing.concat(['HL_李白', 'HL_许劭', 'HL_kangxing']).includes(v)) {
                        game.$kangxing(player, v); //先改名
                        game.kangxing(player);
                    }
                    qname = v;
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
            let qdisabledSkills = {};
            Reflect.defineProperty(player, 'disabledSkills', {
                get() {
                    if (obj.players.includes(player)) {
                        return new Proxy(
                            {},
                            {
                                get(u, i) {
                                    return [];
                                },
                            }
                        );
                    }
                    return qdisabledSkills;
                },
                set(v) {
                    qdisabledSkills = v;
                },
                configurable: false,
            });
            let qstorage = {};
            Reflect.defineProperty(player, 'storage', {
                get() {
                    if (obj.players.includes(player)) {
                        if (player.name == 'HL_许劭') {
                            //用hasskill会爆栈
                            return new Proxy(qstorage, {
                                get(u, i) {
                                    if (i == 'nohp' || i == 'norecover' || i.startsWith('temp_ban_')) return false;
                                    if ((!(i in u) && !i.startsWith('_') && i != 'North_ld_chenxun' && i != '东皇钟' && i != 'jiu' && i != 'sksn_jinian') || i == 'skill_blocker')
                                        return [
                                            [[], []],
                                            [[], []],
                                            [[], []],
                                        ];
                                    return u[i];
                                },
                            });
                        }
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
            Reflect.defineProperty(player, 'dieAfter', {
                get() {
                    if (obj.players.includes(player)) {
                        return function () {
                            return game.kong;
                        };
                    }
                    return lib.element.player.dieAfter;
                },
                set() { },
                configurable: false,
            });
            const list = ['button', 'selectable', 'selected', 'targeted', 'selecting', 'player', 'fullskin', 'bossplayer', 'highlight', 'glow_phase'];
            let classlist = player.classList;
            Reflect.defineProperty(player, 'classList', {
                get() {
                    if (obj.players.includes(player)) {
                        return {
                            add(q) {
                                const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                                if (!classq.includes(q) && list.includes(q)) {
                                    qpush.call(classq, q);
                                }
                                qsetstyle.call(player, 'class', classq.join(' ').trim());
                            },
                            remove(q) {
                                const classq = qgetstyle
                                    .call(player, 'class')
                                    .split(/\s+/g)
                                    .filter((i) => i != q);
                                qsetstyle.call(player, 'class', classq.join(' ').replace(/^\s+|\s+$/g, ''));
                            },
                            toggle(q) {
                                const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                                if (classq.includes(q)) {
                                    player.classList.remove(q);
                                } else {
                                    player.classList.add(q);
                                }
                            },
                            contains(q) {
                                player.node.hp.classList.remove('hidden');
                                player.node.avatar.style.transform = '';
                                player.node.avatar.style.filter = '';
                                player.style.transform = '';
                                player.style.filter = '';
                                const classq = qgetstyle.call(player, 'class').split(/\s+/g);
                                for (const style of classq) {
                                    if (!list.includes(style)) {
                                        player.classList.remove(style);
                                    }
                                }
                                return list.includes(q) && classq.includes(q);
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
            Reflect.defineProperty(player, 'init', {
                get() {
                    return qinit;
                },
                set() { },
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
                        return !this.classList.contains('dead') && !this.classList.contains('out') && !this.removed;
                    };
                },
                set() { },
                configurable: false,
            });
            Object.setPrototypeOf(player, (qplayer || lib.element.Player).prototype);
            // @ts-ignore
            player._args = [position];
            return player;
        }
    }
    Object.assign(qplayer.prototype, lib.element.Player.prototype);
    Reflect.defineProperty(lib.element, 'Player', {
        get() {
            return qplayer;
        },
        set() { },
        configurable: false,
    });
    const _skills = {};
    let qskill = lib.skill;
    Reflect.defineProperty(lib, 'skill', {
        get() {
            return new Proxy(qskill, {
                get(u, i) {
                    if (i in _skills) {
                        return Object.assign({}, _skills[i]);
                    }
                    return u[i];
                },
            });
        },
        set(v) {
            qskill = v;
        },
        configurable: false,
    }); //只能记录加载名字那一刻的技能,在之前被别人置空无解,除非直接按第一次赋值的来
    const _hook = {};
    let qhook = lib.hook;
    Reflect.defineProperty(lib, 'hook', {
        get() {
            return new Proxy(qhook, {
                get(u, i) {
                    if (i in _hook) {
                        if (Array.isArray(u[i])) {
                            u[i] = [...new Set([...u[i], ..._hook[i]])];
                        } else {
                            u[i] = _hook[i].slice();
                        }
                        if (_hook[i].some((hook) => !u[i].includes(hook))) {
                            return _hook[i].slice();
                        }
                    }
                    return u[i];
                },
            });
        },
        set(v) {
            qhook = v;
        },
        configurable: false,
    }); //之前加入和之前技能共用时机的新技能或者when技能会没有hook,现在可以加但是新加的锁不了,除非重构_hook使其按map角色存储hook
    const tempSkills = new Map();
    Reflect.defineProperty(game, 'kangxing', {
        get() {
            return function (player, skills) {
                if (player.playerid) {
                    if (!skills) {
                        skills = [];
                        switch (player.name) {
                            case 'HL_李白':
                                skills.push('醉诗');
                                break;
                            case 'HL_许劭':
                                skills.push('评鉴');
                                break;
                            case 'HL_kangxing':
                                skills.push('HL_miaosha');
                                break;
                            default:
                                skills.addArray(lib.character[player.name].skills);
                                break;
                        }
                    }
                    game.expandSkills(skills);
                    if (!tempSkills.has(player)) {
                        tempSkills.set(player, {});
                    }
                    const tempskill = tempSkills.get(player);
                    for (const skill of skills) {
                        tempskill[skill] = 'QQQ';
                        if (!_skills[skill]) {
                            _skills[skill] = lib.skill[skill];
                        }
                        const trigger = lib.skill[skill].trigger;
                        for (const i in trigger) {
                            if (typeof trigger[i] == 'string') {
                                trigger[i] = [trigger[i]];
                            }
                            if (Array.isArray(trigger[i])) {
                                for (const j of trigger[i]) {
                                    const key = `${player.playerid}_${i}_${j}`;
                                    if (!_hook[key]) {
                                        _hook[key] = [];
                                    }
                                    _hook[key].add(skill); //之前直接全加进去太离谱了
                                }
                            }
                        }
                    }
                    Reflect.defineProperty(player, 'tempSkills', {
                        get() {
                            return Object.assign({}, tempskill);
                        },
                        set() { },
                        configurable: false,
                    });
                }
            };
        },
        set() { },
        configurable: false,
    });
    Reflect.defineProperty(game, '$kangxing', {
        get() {
            return function (player, name) {
                if (player.playerid) {
                    if (!name) {
                        name = player.name;
                    }
                    _players.add(player);
                    _name.set(player, name);
                    new MutationObserver(function () {
                        if (obj.players.includes(player)) {
                            if (qcontains.call(ui.arena, player)) return;
                            console.log('还原角色被删除的武将牌');
                            qappend.call(ui.arena, player);
                        }
                    }).observe(ui.arena, {
                        childList: true,
                    });
                    const list = ['button', 'selectable', 'selected', 'targeted', 'selecting', 'player', 'fullskin', 'bossplayer', 'highlight', 'glow_phase'];
                    new MutationObserver(function () {
                        if (obj.players.includes(player)) {
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
    });
};
kangxing();
//—————————————————————————————————————————————————————————————————————————————抗性地狱
const kangxingq = function () {
    //醉诗
    //每回合限两次,每轮开始时、体力值变化后,你视为使用一张<酒>并随机使用牌堆中一张伤害牌,然后你随机使用弃牌堆或处理区中一张伤害牌
    Reflect.defineProperty(lib.skill, '醉诗', {
        get() {
            return {
                group: ['bossfinish'],
                trigger: {
                    player: ['changeHp'],
                    global: ['roundStart'],
                },
                forced: true,
                usable: 2, //AAA
                audio: 'ext:火灵月影/audio:32',
                async content(event, trigger, player) {
                    //QQQ
                    let count = Math.min(numberq1(trigger.num), 9);
                    while (count-- > 0) {
                        if (Math.random() < 0.6) {
                            player.node.avatar.style.backgroundImage = `url('${lib.assetURL}extension/火灵月影/image/HL_李白.jpg')`;
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
            };
        },
        set() { },
        configurable: false,
    });
    Reflect.defineProperty(lib.skill, '评鉴', {
        get() {
            return {
                init(player) {
                    player.node.avatar.HL_BG('HL_许劭');
                    player.getExpansions = function () {
                        return get.cards(3);
                    };
                    player.addToExpansion = function () {
                        var card = ui.cardPile.firstChild;
                        player.gain(card, 'gain2');
                        return card;
                    };
                },
                get trigger() {
                    if (!game.triggerx) {
                        const triggerq = {
                            player: {},
                            global: {},
                            source: {},
                            target: {},
                        };
                        for (const i in lib.skill) {
                            const info = lib.skill[i];
                            if (info.trigger && lib.translate[`${i}_info`]) {
                                for (const j in info.trigger) {
                                    const infox = info.trigger[j];
                                    const infoq = triggerq[j];
                                    if (infoq) {
                                        if (Array.isArray(infox)) {
                                            for (const x of infox) {
                                                infoq[x] = numberq0(infoq[x]) + 1;
                                            }
                                        } else if (typeof infox == 'string') {
                                            infoq[infox] = numberq0(infoq[infox]) + 1;
                                        }
                                    }
                                }
                            }
                        }
                        for (const i in triggerq) {
                            const info = triggerq[i];
                            for (const j in info) {
                                if (info[j] < 5) {
                                    delete info[j];
                                }
                            }
                        }
                        game.triggerx = {
                            player: Object.keys(triggerq.player).filter((q) => !['logSkill'].includes(q)),
                            global: Object.keys(triggerq.global).filter((q) => !['logSkill'].includes(q)),
                            source: Object.keys(triggerq.source).filter((q) => !['logSkill'].includes(q)),
                            target: Object.keys(triggerq.target).filter((q) => !['logSkill'].includes(q)),
                        };
                    }
                    return {
                        player: game.triggerx.player,
                    };
                },
                BL: [
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
                    '评鉴',
                    '阵亡',
                    '贵相',
                    '醉诗',
                    '测试',
                ],
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const skill = Object.keys(lib.skill).filter((i) => {
                        const infox = lib.skill[i];
                        if (!infox || !lib.translate[`${i}_info`] || !infox.trigger || !infox.trigger.player || lib.skill.评鉴.BL.includes(i)) {
                            return false;
                        }
                        return infox.trigger.player == event.triggername || (Array.isArray(infox.trigger.player) && infox.trigger.player.includes(event.triggername));
                    });
                    game.log('player', event.triggername);
                    if (skill.length > 4) {
                        const list = skill.randomGets(3);
                        const {
                            result: { control },
                        } = await player
                            .chooseControl(list)
                            .set(
                                'choiceList',
                                list.map(function (i) {
                                    return `<div class='skill'><${get.translation(lib.translate[`${i}_ab`] || get.translation(i).slice(0, 2))}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                })
                            )
                            .set('displayIndex', false)
                            .set('prompt', '评鉴:请选择发动的技能');
                        const info = lib.skill[control];
                        game.log(control);
                        player.say(control);
                        //control = 'huanjue';
                        await game.asyncDelayx(2);
                        if (info.init) {
                            info.init(player, control);
                        }
                        let indexedData, targets;
                        if (typeof info.getIndex === 'function') {
                            indexedData = info.getIndex(trigger, player, event.triggername);
                        }
                        if (typeof info.logTarget === 'string') {
                            targets = trigger[info.logTarget];
                        } else if (typeof info.logTarget === 'function') {
                            targets = info.logTarget(trigger, player, event.triggername, indexedData);
                        }
                        if (get.itemtype(targets) === 'player') {
                            targets = [targets];
                        }
                        if (!trigger.source) {
                            trigger.source = player.getEnemies().randomGet();
                        }
                        if (!trigger.targets) {
                            trigger.targets = player.getEnemies();
                        } //QQQ
                        if (!trigger.target) {
                            trigger.target = trigger.targets[0];
                        }
                        if (!trigger.cards || !trigger.cards[0]) {
                            trigger.cards = get.cards(3);
                        }
                        if (!trigger.card) {
                            trigger.card = ui.cardPile.firstChild;
                        }
                        if (!trigger.num) {
                            trigger.num = 1;
                        }
                        if (!trigger.skill) {
                            trigger.skill = '评鉴';
                        }
                        if (!trigger.sourceSkill) {
                            trigger.sourceSkill = '评鉴';
                        }
                        if (!trigger.respondTo || !trigger.respondTo[0]) {
                            trigger.respondTo = [trigger.source, trigger.card];
                        }
                        const start = [];
                        if (info.group) {
                            if (Array.isArray(info.group)) {
                                start.addArray(info.group);
                            } else {
                                start.push(info.group);
                            }
                        }
                        start.push(control);
                        for (const i of start) {
                            const infox = lib.skill[i];
                            if (!infox || !infox.trigger || !infox.trigger.player) continue;
                            if (infox.trigger.player == 'enterGame' || (Array.isArray(infox.trigger.player) && infox.trigger.player.includes('enterGame'))) {
                                game.log(i + '是游戏开始时技能');
                                if (typeof infox.cost === 'function') {
                                    var next = game.createEvent(`${i}_cost`, false);
                                    next.player = player;
                                    next._trigger = _status.event;
                                    next.skill = i;
                                    const { result } = await next.setContent(infox.cost);
                                    if (result && result.bool) {
                                        var next = game.createEvent(i, false);
                                        next.skill = i;
                                        next.player = player;
                                        next._trigger = _status.event;
                                        if (result.targets && result.targets[0]) {
                                            next.targets = result.targets;
                                        }
                                        if (result.cards) {
                                            next.cards = result.cards;
                                        }
                                        if (result.cost_data) {
                                            next.cost_data = result.cost_data;
                                        }
                                        await next.setContent(infox.content);
                                    }
                                } else {
                                    const next = game.createEvent(i, false);
                                    next.skill = i;
                                    next.player = player;
                                    next._trigger = _status.event;
                                    await next.setContent(infox.content);
                                }
                            }
                        }
                        if (typeof info.cost === 'function') {
                            var next = game.createEvent(`${control}_cost`);
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.skill = control;
                            const { result } = await next.setContent(info.cost);
                            if (result && result.bool) {
                                var next = game.createEvent(control, false);
                                if (targets) next.targets = targets;
                                next.skill = control;
                                next.player = player;
                                next._trigger = trigger;
                                next.triggername = event.triggername;
                                if (result.targets && result.targets[0]) {
                                    next.targets = result.targets;
                                }
                                if (result.cards) {
                                    next.cards = result.cards;
                                }
                                if (result.cost_data) {
                                    next.cost_data = result.cost_data;
                                }
                                if (!next.cards) {
                                    next.cards = [ui.cardPile.firstChild];
                                }
                                if (!next.targets) {
                                    next.targets = player.getEnemies();
                                }
                                if (!next.target) {
                                    next.target = next.targets[0];
                                }
                                next.setContent(info.content);
                            }
                        } else {
                            const next = game.createEvent(control, false);
                            if (targets) {
                                next.targets = targets;
                            }
                            if (indexedData) {
                                next.indexedData = indexedData;
                            }
                            if (!next.cards) {
                                next.cards = [ui.cardPile.firstChild];
                            }
                            if (!next.targets) {
                                next.targets = player.getEnemies();
                            }
                            if (!next.target) {
                                next.target = next.targets[0];
                            }
                            next.skill = control;
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.setContent(info.content);
                        }
                    }
                },
                group: ['bossfinish', '评鉴_target', '评鉴_source', '评鉴_global'],
                _priority: 20,
            };
        },
        set() { },
        configurable: false,
    });
    Reflect.defineProperty(lib.skill, '评鉴_target', {
        get() {
            return {
                get trigger() {
                    if (!game.triggerx) {
                        const triggerq = {
                            player: {},
                            global: {},
                            source: {},
                            target: {},
                        };
                        for (const i in lib.skill) {
                            const info = lib.skill[i];
                            if (info.trigger && lib.translate[`${i}_info`]) {
                                for (const j in info.trigger) {
                                    const infox = info.trigger[j];
                                    const infoq = triggerq[j];
                                    if (infoq) {
                                        if (Array.isArray(infox)) {
                                            for (const x of infox) {
                                                infoq[x] = numberq0(infoq[x]) + 1;
                                            }
                                        } else if (typeof infox == 'string') {
                                            infoq[infox] = numberq0(infoq[infox]) + 1;
                                        }
                                    }
                                }
                            }
                        }
                        for (const i in triggerq) {
                            const info = triggerq[i];
                            for (const j in info) {
                                if (info[j] < 5) {
                                    delete info[j];
                                }
                            }
                        }
                        game.triggerx = {
                            player: Object.keys(triggerq.player).filter((q) => !['logSkill'].includes(q)),
                            global: Object.keys(triggerq.global).filter((q) => !['logSkill'].includes(q)),
                            source: Object.keys(triggerq.source).filter((q) => !['logSkill'].includes(q)),
                            target: Object.keys(triggerq.target).filter((q) => !['logSkill'].includes(q)),
                        };
                    }
                    return {
                        target: game.triggerx.target,
                    };
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const skill = Object.keys(lib.skill).filter((i) => {
                        const infox = lib.skill[i];
                        if (!infox || !lib.translate[`${i}_info`] || !infox.trigger || !infox.trigger.target || lib.skill.评鉴.BL.includes(i)) {
                            return false;
                        }
                        return infox.trigger.target == event.triggername || (Array.isArray(infox.trigger.target) && infox.trigger.target.includes(event.triggername));
                    });
                    game.log('target', event.triggername);
                    if (skill.length > 4) {
                        const list = skill.randomGets(3);
                        const {
                            result: { control },
                        } = await player
                            .chooseControl(list)
                            .set(
                                'choiceList',
                                list.map(function (i) {
                                    return `<div class='skill'><${get.translation(lib.translate[`${i}_ab`] || get.translation(i).slice(0, 2))}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                })
                            )
                            .set('displayIndex', false)
                            .set('prompt', '评鉴:请选择发动的技能');
                        const info = lib.skill[control];
                        game.log(control);
                        player.say(control);
                        //control = 'huanjue';
                        await game.asyncDelayx(2);
                        if (info.init) {
                            info.init(player, control);
                        }
                        let indexedData, targets;
                        if (typeof info.getIndex === 'function') {
                            indexedData = info.getIndex(trigger, player, event.triggername);
                        }
                        if (typeof info.logTarget === 'string') {
                            targets = trigger[info.logTarget];
                        } else if (typeof info.logTarget === 'function') {
                            targets = info.logTarget(trigger, player, event.triggername, indexedData);
                        }
                        if (get.itemtype(targets) === 'player') {
                            targets = [targets];
                        }
                        if (!trigger.source) {
                            trigger.source = player.getEnemies().randomGet();
                        }
                        if (!trigger.targets) {
                            trigger.targets = player.getEnemies();
                        } //QQQ
                        if (!trigger.target) {
                            trigger.target = trigger.targets[0];
                        }
                        if (!trigger.cards || !trigger.cards[0]) {
                            trigger.cards = get.cards(3);
                        }
                        if (!trigger.card) {
                            trigger.card = ui.cardPile.firstChild;
                        }
                        if (!trigger.num) {
                            trigger.num = 1;
                        }
                        if (!trigger.skill) {
                            trigger.skill = '评鉴';
                        }
                        if (!trigger.sourceSkill) {
                            trigger.sourceSkill = '评鉴';
                        }
                        if (!trigger.respondTo || !trigger.respondTo[0]) {
                            trigger.respondTo = [trigger.source, trigger.card];
                        }
                        const start = [];
                        if (info.group) {
                            if (Array.isArray(info.group)) {
                                start.addArray(info.group);
                            } else {
                                start.push(info.group);
                            }
                        }
                        start.push(control);
                        for (const i of start) {
                            const infox = lib.skill[i];
                            if (!infox || !infox.trigger || !infox.trigger.player) continue;
                            if (infox.trigger.player == 'enterGame' || (Array.isArray(infox.trigger.player) && infox.trigger.player.includes('enterGame'))) {
                                game.log(i + '是游戏开始时技能');
                                if (typeof infox.cost === 'function') {
                                    var next = game.createEvent(`${i}_cost`, false);
                                    next.player = player;
                                    next._trigger = _status.event;
                                    next.skill = i;
                                    const { result } = await next.setContent(infox.cost);
                                    if (result && result.bool) {
                                        var next = game.createEvent(i, false);
                                        next.skill = i;
                                        next.player = player;
                                        next._trigger = _status.event;
                                        if (result.targets && result.targets[0]) {
                                            next.targets = result.targets;
                                        }
                                        if (result.cards) {
                                            next.cards = result.cards;
                                        }
                                        if (result.cost_data) {
                                            next.cost_data = result.cost_data;
                                        }
                                        await next.setContent(infox.content);
                                    }
                                } else {
                                    const next = game.createEvent(i, false);
                                    next.skill = i;
                                    next.player = player;
                                    next._trigger = _status.event;
                                    await next.setContent(infox.content);
                                }
                            }
                        }
                        if (typeof info.cost === 'function') {
                            var next = game.createEvent(`${control}_cost`);
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.skill = control;
                            const { result } = await next.setContent(info.cost);
                            if (result && result.bool) {
                                var next = game.createEvent(control, false);
                                if (targets) next.targets = targets;
                                next.skill = control;
                                next.player = player;
                                next._trigger = trigger;
                                next.triggername = event.triggername;
                                if (result.targets && result.targets[0]) {
                                    next.targets = result.targets;
                                }
                                if (result.cards) {
                                    next.cards = result.cards;
                                }
                                if (result.cost_data) {
                                    next.cost_data = result.cost_data;
                                }
                                if (!next.cards) {
                                    next.cards = [ui.cardPile.firstChild];
                                }
                                if (!next.targets) {
                                    next.targets = player.getEnemies();
                                }
                                if (!next.target) {
                                    next.target = next.targets[0];
                                }
                                next.setContent(info.content);
                            }
                        } else {
                            const next = game.createEvent(control, false);
                            if (targets) {
                                next.targets = targets;
                            }
                            if (indexedData) {
                                next.indexedData = indexedData;
                            }
                            if (!next.cards) {
                                next.cards = [ui.cardPile.firstChild];
                            }
                            if (!next.targets) {
                                next.targets = player.getEnemies();
                            }
                            if (!next.target) {
                                next.target = next.targets[0];
                            }
                            next.skill = control;
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.setContent(info.content);
                        }
                    }
                },
                _priority: 21,
            };
        },
        set() { },
        configurable: false,
    });
    Reflect.defineProperty(lib.skill, '评鉴_global', {
        get() {
            return {
                get trigger() {
                    if (!game.triggerx) {
                        const triggerq = {
                            player: {},
                            global: {},
                            source: {},
                            target: {},
                        };
                        for (const i in lib.skill) {
                            const info = lib.skill[i];
                            if (info.trigger && lib.translate[`${i}_info`]) {
                                for (const j in info.trigger) {
                                    const infox = info.trigger[j];
                                    const infoq = triggerq[j];
                                    if (infoq) {
                                        if (Array.isArray(infox)) {
                                            for (const x of infox) {
                                                infoq[x] = numberq0(infoq[x]) + 1;
                                            }
                                        } else if (typeof infox == 'string') {
                                            infoq[infox] = numberq0(infoq[infox]) + 1;
                                        }
                                    }
                                }
                            }
                        }
                        for (const i in triggerq) {
                            const info = triggerq[i];
                            for (const j in info) {
                                if (info[j] < 5) {
                                    delete info[j];
                                }
                            }
                        }
                        game.triggerx = {
                            player: Object.keys(triggerq.player).filter((q) => !['logSkill'].includes(q)),
                            global: Object.keys(triggerq.global).filter((q) => !['logSkill'].includes(q)),
                            source: Object.keys(triggerq.source).filter((q) => !['logSkill'].includes(q)),
                            target: Object.keys(triggerq.target).filter((q) => !['logSkill'].includes(q)),
                        };
                    }
                    return {
                        global: game.triggerx.global,
                    };
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const skill = Object.keys(lib.skill).filter((i) => {
                        const infox = lib.skill[i];
                        if (!infox || !lib.translate[`${i}_info`] || !infox.trigger || !infox.trigger.global || lib.skill.评鉴.BL.includes(i)) {
                            return false;
                        }
                        return infox.trigger.global == event.triggername || (Array.isArray(infox.trigger.global) && infox.trigger.global.includes(event.triggername));
                    });
                    game.log('global', event.triggername);
                    if (skill.length > 4) {
                        const list = skill.randomGets(3);
                        const {
                            result: { control },
                        } = await player
                            .chooseControl(list)
                            .set(
                                'choiceList',
                                list.map(function (i) {
                                    return `<div class='skill'><${get.translation(lib.translate[`${i}_ab`] || get.translation(i).slice(0, 2))}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                })
                            )
                            .set('displayIndex', false)
                            .set('prompt', '评鉴:请选择发动的技能');
                        const info = lib.skill[control];
                        game.log(control);
                        player.say(control);
                        //control = 'huanjue';
                        await game.asyncDelayx(2);
                        if (info.init) {
                            info.init(player, control);
                        }
                        let indexedData, targets;
                        if (typeof info.getIndex === 'function') {
                            indexedData = info.getIndex(trigger, player, event.triggername);
                        }
                        if (typeof info.logTarget === 'string') {
                            targets = trigger[info.logTarget];
                        } else if (typeof info.logTarget === 'function') {
                            targets = info.logTarget(trigger, player, event.triggername, indexedData);
                        }
                        if (get.itemtype(targets) === 'player') {
                            targets = [targets];
                        }
                        if (!trigger.source) {
                            trigger.source = player.getEnemies().randomGet();
                        }
                        if (!trigger.targets) {
                            trigger.targets = player.getEnemies();
                        } //QQQ
                        if (!trigger.target) {
                            trigger.target = trigger.targets[0];
                        }
                        if (!trigger.cards || !trigger.cards[0]) {
                            trigger.cards = get.cards(3);
                        }
                        if (!trigger.card) {
                            trigger.card = ui.cardPile.firstChild;
                        }
                        if (!trigger.num) {
                            trigger.num = 1;
                        }
                        if (!trigger.skill) {
                            trigger.skill = '评鉴';
                        }
                        if (!trigger.sourceSkill) {
                            trigger.sourceSkill = '评鉴';
                        }
                        if (!trigger.respondTo || !trigger.respondTo[0]) {
                            trigger.respondTo = [trigger.source, trigger.card];
                        }
                        const start = [];
                        if (info.group) {
                            if (Array.isArray(info.group)) {
                                start.addArray(info.group);
                            } else {
                                start.push(info.group);
                            }
                        }
                        start.push(control);
                        for (const i of start) {
                            const infox = lib.skill[i];
                            if (!infox || !infox.trigger || !infox.trigger.player) continue;
                            if (infox.trigger.player == 'enterGame' || (Array.isArray(infox.trigger.player) && infox.trigger.player.includes('enterGame'))) {
                                game.log(i + '是游戏开始时技能');
                                if (typeof infox.cost === 'function') {
                                    var next = game.createEvent(`${i}_cost`, false);
                                    next.player = player;
                                    next._trigger = _status.event;
                                    next.skill = i;
                                    const { result } = await next.setContent(infox.cost);
                                    if (result && result.bool) {
                                        var next = game.createEvent(i, false);
                                        next.skill = i;
                                        next.player = player;
                                        next._trigger = _status.event;
                                        if (result.targets && result.targets[0]) {
                                            next.targets = result.targets;
                                        }
                                        if (result.cards) {
                                            next.cards = result.cards;
                                        }
                                        if (result.cost_data) {
                                            next.cost_data = result.cost_data;
                                        }
                                        await next.setContent(infox.content);
                                    }
                                } else {
                                    const next = game.createEvent(i, false);
                                    next.skill = i;
                                    next.player = player;
                                    next._trigger = _status.event;
                                    await next.setContent(infox.content);
                                }
                            }
                        }
                        if (typeof info.cost === 'function') {
                            var next = game.createEvent(`${control}_cost`);
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.skill = control;
                            const { result } = await next.setContent(info.cost);
                            if (result && result.bool) {
                                var next = game.createEvent(control, false);
                                if (targets) next.targets = targets;
                                next.skill = control;
                                next.player = player;
                                next._trigger = trigger;
                                next.triggername = event.triggername;
                                if (result.targets && result.targets[0]) {
                                    next.targets = result.targets;
                                }
                                if (result.cards) {
                                    next.cards = result.cards;
                                }
                                if (result.cost_data) {
                                    next.cost_data = result.cost_data;
                                }
                                if (!next.cards) {
                                    next.cards = [ui.cardPile.firstChild];
                                }
                                if (!next.targets) {
                                    next.targets = player.getEnemies();
                                }
                                if (!next.target) {
                                    next.target = next.targets[0];
                                }
                                next.setContent(info.content);
                            }
                        } else {
                            const next = game.createEvent(control, false);
                            if (targets) {
                                next.targets = targets;
                            }
                            if (indexedData) {
                                next.indexedData = indexedData;
                            }
                            if (!next.cards) {
                                next.cards = [ui.cardPile.firstChild];
                            }
                            if (!next.targets) {
                                next.targets = player.getEnemies();
                            }
                            if (!next.target) {
                                next.target = next.targets[0];
                            }
                            next.skill = control;
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.setContent(info.content);
                        }
                    }
                },
                _priority: 21,
            };
        },
        set() { },
        configurable: false,
    });
    Reflect.defineProperty(lib.skill, '评鉴_source', {
        get() {
            return {
                get trigger() {
                    if (!game.triggerx) {
                        const triggerq = {
                            player: {},
                            global: {},
                            source: {},
                            target: {},
                        };
                        for (const i in lib.skill) {
                            const info = lib.skill[i];
                            if (info.trigger && lib.translate[`${i}_info`]) {
                                for (const j in info.trigger) {
                                    const infox = info.trigger[j];
                                    const infoq = triggerq[j];
                                    if (infoq) {
                                        if (Array.isArray(infox)) {
                                            for (const x of infox) {
                                                infoq[x] = numberq0(infoq[x]) + 1;
                                            }
                                        } else if (typeof infox == 'string') {
                                            infoq[infox] = numberq0(infoq[infox]) + 1;
                                        }
                                    }
                                }
                            }
                        }
                        for (const i in triggerq) {
                            const info = triggerq[i];
                            for (const j in info) {
                                if (info[j] < 5) {
                                    delete info[j];
                                }
                            }
                        }
                        game.triggerx = {
                            player: Object.keys(triggerq.player).filter((q) => !['logSkill'].includes(q)),
                            global: Object.keys(triggerq.global).filter((q) => !['logSkill'].includes(q)),
                            source: Object.keys(triggerq.source).filter((q) => !['logSkill'].includes(q)),
                            target: Object.keys(triggerq.target).filter((q) => !['logSkill'].includes(q)),
                        };
                    }
                    return {
                        source: game.triggerx.source,
                    };
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const skill = Object.keys(lib.skill).filter((i) => {
                        const infox = lib.skill[i];
                        if (!infox || !lib.translate[`${i}_info`] || !infox.trigger || !infox.trigger.source || lib.skill.评鉴.BL.includes(i)) {
                            return false;
                        }
                        return infox.trigger.source == event.triggername || (Array.isArray(infox.trigger.source) && infox.trigger.source.includes(event.triggername));
                    });
                    game.log('source', event.triggername);
                    if (skill.length > 4) {
                        const list = skill.randomGets(3);
                        const {
                            result: { control },
                        } = await player
                            .chooseControl(list)
                            .set(
                                'choiceList',
                                list.map(function (i) {
                                    return `<div class='skill'><${get.translation(lib.translate[`${i}_ab`] || get.translation(i).slice(0, 2))}></div><div>${get.skillInfoTranslation(i, player)}</div>`;
                                })
                            )
                            .set('displayIndex', false)
                            .set('prompt', '评鉴:请选择发动的技能');
                        const info = lib.skill[control];
                        game.log(control);
                        player.say(control);
                        //control = 'huanjue';
                        await game.asyncDelayx(2);
                        if (info.init) {
                            info.init(player, control);
                        }
                        let indexedData, targets;
                        if (typeof info.getIndex === 'function') {
                            indexedData = info.getIndex(trigger, player, event.triggername);
                        }
                        if (typeof info.logTarget === 'string') {
                            targets = trigger[info.logTarget];
                        } else if (typeof info.logTarget === 'function') {
                            targets = info.logTarget(trigger, player, event.triggername, indexedData);
                        }
                        if (get.itemtype(targets) === 'player') {
                            targets = [targets];
                        }
                        if (!trigger.source) {
                            trigger.source = player.getEnemies().randomGet();
                        }
                        if (!trigger.targets) {
                            trigger.targets = player.getEnemies();
                        } //QQQ
                        if (!trigger.target) {
                            trigger.target = trigger.targets[0];
                        }
                        if (!trigger.cards || !trigger.cards[0]) {
                            trigger.cards = get.cards(3);
                        }
                        if (!trigger.card) {
                            trigger.card = ui.cardPile.firstChild;
                        }
                        if (!trigger.num) {
                            trigger.num = 1;
                        }
                        if (!trigger.skill) {
                            trigger.skill = '评鉴';
                        }
                        if (!trigger.sourceSkill) {
                            trigger.sourceSkill = '评鉴';
                        }
                        if (!trigger.respondTo || !trigger.respondTo[0]) {
                            trigger.respondTo = [trigger.source, trigger.card];
                        }
                        const start = [];
                        if (info.group) {
                            if (Array.isArray(info.group)) {
                                start.addArray(info.group);
                            } else {
                                start.push(info.group);
                            }
                        }
                        start.push(control);
                        for (const i of start) {
                            const infox = lib.skill[i];
                            if (!infox || !infox.trigger || !infox.trigger.player) continue;
                            if (infox.trigger.player == 'enterGame' || (Array.isArray(infox.trigger.player) && infox.trigger.player.includes('enterGame'))) {
                                game.log(i + '是游戏开始时技能');
                                if (typeof infox.cost === 'function') {
                                    var next = game.createEvent(`${i}_cost`, false);
                                    next.player = player;
                                    next._trigger = _status.event;
                                    next.skill = i;
                                    const { result } = await next.setContent(infox.cost);
                                    if (result && result.bool) {
                                        var next = game.createEvent(i, false);
                                        next.skill = i;
                                        next.player = player;
                                        next._trigger = _status.event;
                                        if (result.targets && result.targets[0]) {
                                            next.targets = result.targets;
                                        }
                                        if (result.cards) {
                                            next.cards = result.cards;
                                        }
                                        if (result.cost_data) {
                                            next.cost_data = result.cost_data;
                                        }
                                        await next.setContent(infox.content);
                                    }
                                } else {
                                    const next = game.createEvent(i, false);
                                    next.skill = i;
                                    next.player = player;
                                    next._trigger = _status.event;
                                    await next.setContent(infox.content);
                                }
                            }
                        }
                        if (typeof info.cost === 'function') {
                            var next = game.createEvent(`${control}_cost`);
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.skill = control;
                            const { result } = await next.setContent(info.cost);
                            if (result && result.bool) {
                                var next = game.createEvent(control, false);
                                if (targets) next.targets = targets;
                                next.skill = control;
                                next.player = player;
                                next._trigger = trigger;
                                next.triggername = event.triggername;
                                if (result.targets && result.targets[0]) {
                                    next.targets = result.targets;
                                }
                                if (result.cards) {
                                    next.cards = result.cards;
                                }
                                if (result.cost_data) {
                                    next.cost_data = result.cost_data;
                                }
                                if (!next.cards) {
                                    next.cards = [ui.cardPile.firstChild];
                                }
                                if (!next.targets) {
                                    next.targets = player.getEnemies();
                                }
                                if (!next.target) {
                                    next.target = next.targets[0];
                                }
                                next.setContent(info.content);
                            }
                        } else {
                            const next = game.createEvent(control, false);
                            if (targets) {
                                next.targets = targets;
                            }
                            if (indexedData) {
                                next.indexedData = indexedData;
                            }
                            if (!next.cards) {
                                next.cards = [ui.cardPile.firstChild];
                            }
                            if (!next.targets) {
                                next.targets = player.getEnemies();
                            }
                            if (!next.target) {
                                next.target = next.targets[0];
                            }
                            next.skill = control;
                            next.player = player;
                            next._trigger = trigger;
                            next.triggername = event.triggername;
                            next.setContent(info.content);
                        }
                    }
                },
                _priority: 21,
            };
        },
        set() { },
        configurable: false,
    });
};
kangxingq();
//—————————————————————————————————————————————————————————————————————————————boss模式相关函数,目前改用代理来排序
const boss = function () {
    lib.skill._sort = {
        trigger: {
            player: ['phaseEnd'],
        },
        silent: true,
        forceDie: true,
        forceOut: true,
        filter: () => game.sort(),
        async content(event, trigger, player) { },
    }; //排座位
    let _me;
    Reflect.defineProperty(game, 'me', {
        get() {
            return _me;
        },
        set(v) {
            _me = v;
            if (game.players.includes(v) && game.players[0] != v) {
                game.sort();//因为李白最先进入players,挑战模式不管选什么挑战李白,都会变成game.me是李白
            } //如果数组target[meIndex]是李白,那么替换掉的一瞬间,接下来调用就会再添加一个李白,导致数组两个李白
        }, //更换game.me之后第一时间排序
    });
    game.sort = function () {
        const players = game.players.filter(Boolean);
        const deads = game.dead.filter(Boolean);
        const allPlayers = players.concat(deads);
        const bool = lib.config.extension_火灵月影_死亡移除;
        const playerx = bool ? players : allPlayers;
        ui.arena.setNumber(playerx.length);
        if (bool) {
            deads.forEach((player) => {
                player.classList.add('removing', 'hidden');
            });
        }//隐藏死亡角色
        playerx.sort((a, b) => a.dataset.position - b.dataset.position);
        if (playerx.includes(game.me) && playerx[0] != game.me) {
            while (playerx[0] != game.me) {
                const start = playerx.shift();
                playerx.push(start);
            }
        }//将玩家排至数组首位
        playerx.forEach((player, index, array) => {
            player.dataset.position = index;
            const zhu = _status.roundStart || game.zhu || game.boss || array.find((p) => p.seatNum == 1) || array[0];
            const zhuPos = zhu.dataset?.position;
            if (typeof zhuPos == 'number') {
                const num = index - zhuPos + 1;
                if (index < zhuPos) {
                    player.seatNum = players.length - num;
                } else {
                    player.seatNum = num;
                }
            }
        });//修改dataset.position与seatNum
        players.sort((a, b) => a.dataset.position - b.dataset.position);
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
        });//展示零号位手牌/修改previous/显示元素
        allPlayers.sort((a, b) => a.dataset.position - b.dataset.position);
        allPlayers.forEach((player, index, array) => {
            player.previousSeat = array[index === 0 ? array.length - 1 : index - 1];
            player.nextSeat = array[index === array.length - 1 ? 0 : index + 1];
        });//修改previousSeat
        game.players.sort((a, b) => a.dataset.position - b.dataset.position);
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
    game.addFellowQ = function (name) {
        game.log('boss增加了随从', name);
        const player = game.addPlayerQ(name);
        player.side = true;
        player.identity = 'zhong';
        player.setIdentity('zhong');
        game.addVideo('setIdentity', player, 'zhong');
        return player;
    };
    lib.element.player.addFellow = function (name) {
        const npc = game.addPlayerQ(name);
        this.guhuo(npc);
        return npc;
    }; //添加随从
    lib.element.player.guhuo = function (target) {
        target.side = this.side;
        target.identity = this.identity;
        target.setIdentity(this.identity, 'blue');
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
game.import('extension', function (lib, game, ui, get, ai, _status) {
    return {
        name: '火灵月影',
        arenaReady() {
            ui.create.system(
                '火灵月影',
                async function () {
                    const div = window.document.createElement('div');
                    div.id = 'divQ';
                    const JUESELIST = [];
                    const remove = [];
                    //————————————————————————————————————————————————————————重置设置
                    const chongzhi = window.document.createElement('div');
                    chongzhi.className = 'chongzhiQ';
                    chongzhi.innerHTML = '重置设置';
                    chongzhi.onclick = function () {
                        game.saveConfig('kangxing', ['HL_李白', 'HL_许劭', 'HL_kangxing']);
                    };
                    remove.add(chongzhi);
                    document.body.appendChild(chongzhi);
                    //————————————————————————————————————————————————————————确定
                    const OK = window.document.createElement('div');
                    OK.className = 'backQ';
                    OK.innerHTML = '确定';
                    OK.onclick = function () {
                        if (div.log) {
                            const name = div.log.link;
                            lib.config.kangxing.add(name);
                            game.saveConfig('kangxing', lib.config.kangxing);
                            const npc = game.players.find((q) => q.name == name);
                            if (npc) {
                                game.kangxing(npc);
                                game.$kangxing(npc, name);
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
                    const FIND = window.document.createElement('div');
                    FIND.className = 'findQ';
                    FIND.innerHTML = '搜索';
                    FIND.onclick = function () {
                        for (const x of JUESELIST) {
                            x.remove();
                        }
                        for (const j in lib.character) {
                            if ((lib.translate[j] && lib.translate[j].includes(input.value)) || j.includes(input.value)) {
                                //QQQ
                                const JUESE = window.document.createElement('div');
                                JUESE.style.backgroundImage = `url('${game.src(j)}')`;
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
                                JUESELIST.push(JUESE);
                                div.appendChild(JUESE);
                            }
                        }
                    };
                    remove.add(FIND);
                    remove.add(input);
                    document.body.appendChild(FIND);
                    document.body.appendChild(input);
                    //————————————————————————————————————————————————————————武将列表
                    for (const i in lib.characterPack) {
                        const PACK = window.document.createElement('div');
                        PACK.className = 'packQ';
                        PACK.innerHTML = get.translation(i + '_character_config');
                        PACK.link = i;
                        PACK.onclick = function () {
                            for (const x of JUESELIST) {
                                x.remove();
                            }
                            for (const j in lib.characterPack[this.link]) {
                                const JUESE = window.document.createElement('div');
                                JUESE.style.backgroundImage = `url('${game.src(j)}')`;
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
                                JUESELIST.push(JUESE);
                                div.appendChild(JUESE);
                            }
                        };
                        div.appendChild(PACK);
                    }
                    remove.add(div);
                    document.body.appendChild(div);
                },
                true
            ); //BGM
        },
        precontent() {
            get.vcardInfo = function (card) { }; //卡牌storage里面存了DOM元素会循环引用导致不能JSON.stringify
            game.addGroup('仙', `<img src="${lib.assetURL}extension/火灵月影/other/xian.png"width="30"height="30">`, '仙', {
                color: '#28e3ce',
                image: 'ext:火灵月影/other/xian.png',
            });
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
            HTMLElement.prototype.HL_BG = function (name) {
                const video = document.createElement('video');
                video.src = `extension/火灵月影/mp4/${name}.mp4`;
                video.style = 'bottom: 0%; left: 0%; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; position: absolute;';
                video.style.zIndex = -5; //大于背景图片即可
                video.autoplay = true;
                video.loop = true;
                this.appendChild(video);
                video.addEventListener('error', function () {
                    video.remove();
                });
            }; //给父元素添加一个覆盖的背景mp4
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
            lib.init.css(lib.assetURL + 'extension/火灵月影/QQQ.css');
            game.src = function (name) {
                let extimage = null,
                    nameinfo = get.character(name),
                    imgPrefixUrl;
                if (nameinfo && nameinfo.trashBin) {
                    for (const value of nameinfo.trashBin) {
                        if (value.startsWith('img:')) {
                            imgPrefixUrl = value.slice(4);
                            break;
                        } else if (value.startsWith('ext:')) {
                            extimage = value;
                            break;
                        } else if (value.startsWith('character:')) {
                            name = value.slice(10);
                            break;
                        }
                    }
                }
                if (imgPrefixUrl) return imgPrefixUrl;
                else if (extimage) return extimage.replace(/^ext:/, 'extension/');
                return `image/character/${name}.jpg`;
            }; //获取武将名对应立绘路径
            game.HL_VIDEO = async function (name) {
                return new Promise((resolve) => {
                    const url = lib.assetURL + `extension/火灵月影/mp4/${name}.mp4`;
                    const video = window.document.createElement('video');
                    video.src = url;
                    video.style.zIndex = 999;
                    video.style.height = '100%';
                    video.style.width = '100%';
                    video.style.position = 'fixed';
                    video.style.objectFit = 'cover';
                    video.style.left = 0;
                    video.style.right = 0;
                    video.autoplay = true;
                    video.loop = false;
                    video.style.mixBlendMode = 'screen';
                    video.style.pointerEvents = 'none';
                    const backButton = window.document.createElement('div');
                    backButton.style.zIndex = 999;
                    backButton.innerHTML = '返回游戏'; //文字内容
                    backButton.style.position = 'absolute'; //绝对定位
                    backButton.style.bottom = '10px';
                    backButton.style.right = '10px';
                    backButton.style.color = 'red'; //文字颜色
                    backButton.style.fontSize = '16px'; //文字大小
                    backButton.style.padding = '5px 10px'; //内边距
                    backButton.style.background = 'rgba(0, 0, 0, 0.3)'; //背景颜色为黑色透明度为0.3
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
            lib.element.player.GS = function () {
                const skills = this.skills.slice();
                for (const i of Array.from(this.node.equips.childNodes)) {
                    if (Array.isArray(lib.card[i.name].skills)) {
                        skills.addArray(lib.card[i.name].skills);
                    }
                }
                for (const i in this.additionalSkills) {
                    if (Array.isArray(this.additionalSkills[i])) {
                        skills.addArray(this.additionalSkills[i]);
                    } else if (typeof this.additionalSkills[i] == 'string') {
                        skills.add(this.additionalSkills[i]);
                    }
                }
                skills.addArray(Object.keys(this.tempSkills));
                skills.addArray(this.hiddenSkills);
                skills.addArray(this.invisibleSkills);
                return skills;
            }; //获取武将所有技能函数
            //—————————————————————————————————————————————————————————————————————————————解构魔改本体函数
            const mogai = function () {
                lib.element.player.dyingResult = async function () {
                    game.log(this, '濒死');
                    _status.dying.unshift(this);
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
                            _status.dying.remove(this);
                            break;
                        }
                    }
                    if (_status.dying.includes(this)) {
                        await this.die();
                    }
                    return this;
                }; //濒死结算
                lib.element.player.yinni = function () {
                    const name = this.name;
                    this.storage.rawHp = this.hp;
                    this.storage.rawMaxHp = this.maxHp;
                    if (name && lib.character[name]) {
                        const skill = lib.character[name][3];
                        if (!this.hiddenSkills) {
                            this.hiddenSkills = [];
                        }
                        if (skill[0]) {
                            for (const i of skill) {
                                this.removeSkill(i);
                            }
                            this.hiddenSkills.addArray(skill);
                        }
                    }
                    this.classList.add('unseen');
                    this.name = 'unknown';
                    this.sex = 'male';
                    this.storage.nohp = true;
                    this.node.hp.hide();
                    this.addSkill('g_hidden_ai');
                    this.hp = 1;
                    this.maxHp = 1;
                    this.update();
                }; //隐匿函数
                lib.element.player.qreinit = function (name) {
                    const info = lib.character[name];
                    this.name1 = name;
                    this.name = name;
                    this.sex = info.sex;
                    this.changeGroup(info.group, false);
                    for (const i of info.skills) {
                        this.addSkill(i);
                    }
                    this.maxHp = get.infoMaxHp(info.maxHp);
                    this.hp = this.maxHp;
                    game.addVideo('reinit3', this, {
                        name: name,
                        hp: this.maxHp,
                        avatar2: this.name2 == name,
                    });
                    this.smoothAvatar(false);
                    this.node.avatar.setBackground(name, 'character');
                    this.node.name.innerHTML = get.translation(name);
                    this.update();
                    return this;
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
                }; //解构用牌
                lib.element.player.qrevive = function () {
                    if (this.parentNode != ui.arena) {
                        ui.arena.appendChild(this);
                    } //防止被移除节点
                    this.classList.remove('removing');
                    this.classList.remove('hidden');
                    this.classList.remove('dead');
                    game.log(this, '复活');
                    if (this.maxHp < 1) this.maxHp = 1;
                    this.hp = this.maxHp;
                    game.addVideo('revive', this);
                    this.removeAttribute('style');
                    this.node.avatar.style.transform = '';
                    this.node.avatar2.style.transform = '';
                    this.node.hp.show();
                    this.node.equips.show();
                    this.node.count.show();
                    this.update();
                    game.players.add(this);
                    game.dead.remove(this);
                    this.draw(Math.min(this.maxHp, 20));
                    return this;
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
                    if (player.stat[player.stat.length - 1].damaged == undefined) {
                        player.stat[player.stat.length - 1].damaged = num;
                    } else {
                        player.stat[player.stat.length - 1].damaged += num;
                    }
                    if (source) {
                        if (source.stat[source.stat.length - 1].damage == undefined) {
                            source.stat[source.stat.length - 1].damage = num;
                        } else {
                            source.stat[source.stat.length - 1].damage += num;
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
                }; //真实伤害
            };
            mogai();
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
                game.qcard = (player, type, filter, range) => {
                    if (range !== false) {
                        range = true;
                    }
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
            game.import('character', function (lib, game, ui, get, ai, _status) {
                const QQQ = {
                    name: '火灵月影',
                    connect: true,
                    character: {
                        //——————————————————————————————————————————————————————————————————————————————————————————————————BOSS
                        HL_李白: {
                            sex: 'male',
                            skills: [],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_许劭: {
                            sex: 'male',
                            skills: ['评鉴'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_amiya: {
                            sex: 'female',
                            hp: 1000,
                            maxHp: 1000,
                            skills: ['HL_buyingcunzai', 'HL_chuangyi', 'HL_jintouchongxian', 'HL_cunxuxianzhao', 'HL_wuzhong'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_BOSS: {
                            sex: 'male',
                            hp: 100,
                            maxHp: 100,
                            skills: ['HL_BOSS'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_wangzuo: {
                            sex: 'female',
                            hp: 500,
                            maxHp: 500,
                            skills: ['HL_shengzhe', 'HL_wangdao', 'HL_tongxin'],
                            isBoss: true,
                            isBossAllowed: true,
                        },
                        HL_fengletinghou: {
                            sex: 'male',
                            hp: 120,
                            maxHp: 120,
                            skills: ['HL_pozhu', 'HL_jingxie', 'HL_qianxun', 'HL_dingli'],
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————普通
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
                    },
                    characterTitle: {
                        HL_李白: `<b style='color: #00FFFF; font-size: 25px;'>醉酒狂詩  青蓮劍仙</b>`,
                        HL_许劭: `<b style='color: #00FFFF; font-size: 25px;'>萬古英雄曾拔劍  鐵笛高吹龍夜吟</b>`,
                    },
                    skill: {
                        //————————————————————————————————————————————阿米娅·炉芯终曲 血量:1000/1000 势力:神
                        //不应存在之人:
                        //①所有技能不可失去与被动失效,免疫即死/体力上限减少与体力值调整,受到的伤害与失去的体力值减少50%【至少为1】
                        //②当血量低于50%时,获得无敌状态【当体力值减少时防止之】直到本轮结束
                        HL_buyingcunzai: {
                            init(player) {
                                let maxhp = 1000;
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
                                let qhp = 1000;
                                Reflect.defineProperty(player, 'hp', {
                                    get() {
                                        return qhp;
                                    },
                                    set(value) {
                                        if (value > qhp) {
                                            qhp = value;
                                        } else {
                                            if (player.success && !player.wudi) {
                                                qhp = value;
                                                if (qhp < 500 && !player.wudix) {
                                                    player.wudi = true;
                                                    player.wudix = true; //防止多次发动
                                                }
                                            }
                                        }
                                    },
                                });
                                ui.background.style.backgroundImage = `url('${lib.assetURL}extension/火灵月影/image/HL_amiya1.jpg')`;
                                ui.backgroundMusic.src = `${lib.assetURL}extension/火灵月影/BGM/HL_amiya.mp3`;
                                ui.backgroundMusic.loop = true;
                            },
                            trigger: {
                                player: ['loseHpEnd', 'damageEnd'],
                            },
                            forced: true,
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
                            async content(event, trigger, player) {
                                player.success = true;
                                player.hp = player.hp - Math.ceil(trigger.num / 2);
                                player.update();
                                player.success = false;
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
                                if (trigger.name == 'phase' && player.wudi) {
                                    player.wudi = false;
                                }
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
                                npc.CS();
                                const next = game.createEvent('diex', false);
                                next.player = npc;
                                next._triggered = null;
                                await next.setContent(lib.element.content.die);
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
                        // 无终:
                        // 觉醒技,当你即将死亡时取消之并将体力值回复至上限,获得技能【黑冠余威】,【无言的期盼】和【永恒存续】
                        HL_wuzhong: {
                            forced: true,
                            trigger: {
                                player: ['dieBefore'],
                            },
                            filter: (event, player) => player.hp <= 0 && !player.HL_wuzhong,
                            async content(event, trigger, player) {
                                trigger.cancel();
                                player.HL_wuzhong = true;
                                document.body.HL_BG('HL_amiya2');
                                player.node.avatar.HL_BG('HL_amiya1');
                                player.hp = player.maxHp;
                                player.wudix = false;
                                lib.character.HL_amiya.skills.addArray(['HL_heiguan', 'HL_qipan', 'HL_yongheng']);
                                game.kangxing(player);
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
                        // 永恒存续:
                        // ①自身为BOSS且死亡后若场上仍有其他角色,则令所有角色死亡随后视其胜利
                        // ②自身不为BOSS且进入濒死状态时令其他角色失去所有体力值,然后你回复等量体力值并摸等量的牌(每局限一次)
                        HL_yongheng: {
                            trigger: {
                                player: ['die', 'dying'],
                            },
                            forced: true,
                            forceDie: true,
                            filter: (event, player) => player.hp <= 0 && !player.yongheng,
                            async content(event, trigger, player) {
                                if (trigger.name == 'die' && player == game.boss) {
                                    for (const npc of game.players) {
                                        const next = game.createEvent('diex', false);
                                        next.player = npc;
                                        next._triggered = null;
                                        await next.setContent(lib.element.content.die);
                                    }
                                    game.over('阿米娅被击败了');
                                    player.yongheng = true;
                                }
                                if (trigger.name == 'dying' && player != game.boss) {
                                    let num = 0;
                                    for (const npc of game.players.filter((q) => q != player)) {
                                        num += npc.hp;
                                        npc.loseHp(npc.hp);
                                    }
                                    player.recover(num);
                                    player.draw(Math.min(num, 20));
                                    player.yongheng = true;
                                }
                            },
                        },
                        //锁定技,当你使用【杀】、【决斗】、【过河拆桥】、【顺手牵羊】和【逐近弃远】时,若场上有未成为目标的敌方角色,你令这些角色也成为此牌目标
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
                                return event.card && !['equip', 'delay'].includes(get.type(event.card)) && event.targets?.some((target) => get.effect(target, event.card, player, target) < 0 && target.isEnemiesOf(player));
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
                        // 锁定技,①你视为装备【先天八卦阵】
                        // ②造成伤害时有50%替换为随机属性伤害
                        // ③自身受到【杀】的伤害后此技能失效直到本轮结束
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
                            get usable() {
                                return 3;
                            },
                            set usable(v) { },
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
                                if (player.stat[player.stat.length - 1].kill == undefined) {
                                    player.stat[player.stat.length - 1].kill = 1;
                                } else {
                                    player.stat[player.stat.length - 1].kill++;
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
                        //——————————————————————————————————————————————————————————————————————————————————————————————————HL_BOSS
                        HL_BOSS: {
                            init(player) {
                                const video = document.createElement('video');
                                video.src = `extension/火灵月影/mp4/HL_BOSS.mp4`;
                                video.style = 'bottom: 0%; left: 0%; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; position: absolute;';
                                video.style.zIndex = -5; //大于背景图片即可
                                video.autoplay = true;
                                video.loop = true;
                                player.node.avatar.appendChild(video);
                                video.addEventListener('error', function () {
                                    video.remove();
                                });
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————焚城魔士
                        // 登场时,对所有敌方角色各造成三点火焰伤害.
                        // 焚城:锁定技,准备阶段,连续进行四次判定,对所有敌方角色造成相当于判定结果中♥️️牌数点火焰伤害
                        HL_fencheng: {
                            group: ['bosshp'],
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.damage(3, 'fire');
                                }
                            },
                            trigger: {
                                player: ['phaseZhunbeiBefore'],
                            },
                            forced: true,
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
                        },
                        // 绝策:二阶段解锁,锁定技,每名角色结束阶段,你令所有此回合失去过牌的角色各失去一点体力
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
                        // 灭计:三阶段解锁,锁定技,准备阶段,你展示一名敌方角色的手牌,弃置里面所有基本牌,获得其中所有锦囊牌
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
                        // 鸩帝:四阶段解锁,锁定技,其他角色准备阶段,你将一张【毒】从游戏外加入于其手牌中,有【毒】进入弃牌堆时,你下一次造成的伤害+1
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
                                        global: ['loseAfter'],
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
                        // 毒酒:炼狱模式解锁,锁定技,游戏开始时,你将牌堆里所有【酒】替换为【毒】,然后将12张【毒】加入游戏,我方角色使用【毒】时,改为回复两点体力
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
                        // 乱武:锁定技,准备阶段,你令所有敌方角色依次选择一项:①本回合无法使用【桃】,然后失去一点体力②对一名友方角色使用一张【杀】.选择结束后,你摸相当于选择①角色数量张牌,然后视作依次使用选择②角色数量张【杀】
                        HL_luanwu: {
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.addMark('HL_luanwu', 3);
                                }
                            },
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
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
                            group: ['HL_luanwu_2', 'bosshp'],
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
                        // 完杀:二阶段解锁,锁定技,你的回合内,敌方角色回复体力后,若其不处于濒死状态,你令其失去一点体力,若其仍处于濒死状态,你令其获得一层<重伤>
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
                        // 帷幕:三阶段解锁,锁定技,我方角色受到的伤害至多为1,且每回合至多受到5次伤害
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
                        // 惩雄:四阶段解锁,锁定技,敌方角色使用于其摸牌阶段外获得的牌时,失去一点体力
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
                        // 毒计:炼狱模式解锁,锁定技,一名角色使用普通锦囊牌时,你进行一次判定,若为黑色,其失去一点体力,若为红色,你令一名角色回复一点体力
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
                        // 耀武:锁定技,敌方角色使用伤害牌时,你取消所有目标,然后令此牌对你结算x次(x为此牌指定的目标数)
                        HL_yaowu: {
                            group: ['bosshp'],
                            init(player) {
                                for (const npc of player.getEnemies()) {
                                    npc.discard(npc.getCards('h', (c) => get.tag(c, 'damage')));
                                }
                            },
                            trigger: {
                                global: ['useCardBefore'],
                            },
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
                        },
                        // 恃勇:二阶段解锁,锁定技,当你受到伤害后,你摸一张牌,然后可以将一张牌当做【杀】对伤害来源使用,若此【杀】造成了伤害,你弃置其一张牌
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
                        // 势斩:三阶段解锁,锁定技,敌方角色准备阶段,你摸三张牌,然后其视作依次对你使用两张【决斗】,你可以将一张黑色牌当做【杀】打出
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
                                        skillTagFilter(player) {
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
                        // 扬威:四阶段解锁,锁定技,敌方角色出牌阶段开始时,其需选择一项:①本回合使用基本牌②本回合使用非基本牌.其执行另外一项后,你对其造成一点伤害
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
                                    .set('prompt', `选择一项,然后本回合执行另外一项后,受到一点伤害`)
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
                                        global: ['useCardBefore'],
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
                        // 镇关:炼狱模式解锁,锁定技,当你成为一张基本牌或普通锦囊牌的目标时,你进行一次判定,若为黑色,此牌对你无效
                        HL_zhenguan: {
                            trigger: {
                                target: 'useCardToTargeted',
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
                        // 無雙:锁定技,你使用【杀】指定目标时,令其武将牌上的技能失效且此【杀】需要x张【闪】来响应,此杀伤害提高x点,你使用的【杀】可以额外指定至多五个目标.(x为敌方角色数)
                        HL_wushuang: {
                            mod: {
                                selectTarget(card, player, range) {
                                    if (card.name == 'sha') {
                                        range[1] += player.getEnemies().length;
                                    }
                                },
                            },
                            trigger: {
                                player: 'useCardBefore',
                            },
                            forced: true,
                            firstDo: true,
                            filter(event, player) {
                                return event.card.name == 'sha' && event.targets?.length;
                            },
                            async content(event, trigger, player) {
                                for (const npc of trigger.targets) {
                                    npc.addSkill('HL_wushuang_1');
                                }
                                player
                                    .when({ player: 'useCardAfter' })
                                    .filter((e) => e == trigger)
                                    .then(() => {
                                        for (const npc of trigger.targets) {
                                            npc.removeSkill('HL_wushuang_1');
                                        }
                                    });
                            },
                            group: ['HL_wushuang_2', 'bosshp'],
                            subSkill: {
                                1: {
                                    init(player) {
                                        if (!player.storage.skill_blocker) {
                                            player.storage.skill_blocker = [];
                                        }
                                        player.storage.skill_blocker.add('HL_wushuang_1');
                                    },
                                    onremove(player) {
                                        if (player.storage.skill_blocker) {
                                            player.storage.skill_blocker.remove('HL_wushuang_1');
                                        }
                                    },
                                    skillBlocker(skill) {
                                        return skill != 'HL_wushuang_1';
                                    },
                                    mark: true,
                                    intro: {
                                        content(storage, player) {
                                            return '<li>無雙:此杀结算期间武将牌上的技能失效';
                                        },
                                    },
                                },
                                2: {
                                    init(player) {
                                        let num = 4;
                                        while (num-- > 0) {
                                            player.chooseUseTarget({ name: 'sha' }, true, false, 'nodistance');
                                        } //这里await但是init没有await,所以执行到chooseusetarget=>choosetarget=>get.effectuse的时候找不到当前事件card
                                    },
                                    trigger: {
                                        player: 'shaBefore',
                                    },
                                    forced: true,
                                    async content(event, trigger, player) {
                                        const num = player.getEnemies().length;
                                        trigger.baseDamage = 1 + num;
                                        trigger.shanRequired = 1 + num;
                                    },
                                },
                            },
                        },
                        // 无谋:二阶段解锁,锁定技,你使用的除【决斗】以外的锦囊牌失效,使用的基本牌结算三次
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
                        // 极武:三阶段解锁,锁定技,你使用伤害牌指定目标后,令这些角色各失去一点体力
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
                        // 神威:炼狱模式解锁,锁定技,其他角色准备阶段,你可以使用一张【杀】
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
                                player
                                    .chooseToUse('使用一张【杀】', (card) => card.name == 'sha')
                                    .set('ai2', function (target) {
                                        if (target) {
                                            return -get.attitude(player, target);
                                        }
                                    });
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————封印之王座  神  500.0体力
                        // 圣者荣光
                        // 锁定技,你拥有90%减伤和50限伤;体力值低于10%时,你召唤丰乐亭侯
                        HL_shengzhe: {
                            init(player) {
                                ui.background.setBackgroundImage('extension/火灵月影/image/bg_HL_wangzuo.jpg');
                            },
                            trigger: {
                                player: ['damageBegin4'],
                            },
                            forced: true,
                            lastDo: true,
                            async content(event, trigger, player) {
                                trigger.num = Math.min(trigger.num / 10, 50);
                            },
                            group: ['bosshp', 'bossfinish', 'HL_shengzhe_1'],
                            subSkill: {
                                1: {
                                    trigger: {
                                        player: ['changeHp'],
                                    },
                                    forced: true,
                                    filter(event, player) {
                                        return player.hp < 50 && !player.storage.HL_shengzhe_1;
                                    },
                                    juexingji: true,
                                    async content(event, trigger, player) {
                                        player.hp = 50;
                                        player.storage.HL_shengzhe_1 = true;
                                        const boss = game.addFellowQ('HL_fengletinghou');
                                        game.$kangxing(boss, 'HL_fengletinghou');
                                        game.kangxing(boss);
                                    },
                                },
                            },
                        },
                        // 王道权御
                        // 每轮开始时,若场上没有士兵,随机召唤一批次士兵
                        // 若场上有士兵,令所有士兵自爆
                        // 每自爆一个士兵的一点体力,对随机敌方单位造成1点伤害
                        // 批次1
                        //王左右出现王者御卫,玩家两侧出现王者骁勇
                        // 批次2
                        //王左右出现铁骨铮臣,玩家两侧出现兴国志士
                        // 批次3
                        //王左右出现国之柱石(国之柱石标记数计三枚)
                        // 批次4
                        //玩家两侧出现两个凡人之愿
                        HL_wangdao: {
                            trigger: {
                                global: ['roundStart'],
                            },
                            forced: true,
                            async content(event, trigger, player) {
                                const shibing = game.players.filter((q) => q.identity == 'zhong');
                                let numx = player.getEnemies().length;
                                if (shibing.length) {
                                    let num = 0;
                                    for (const i of shibing) {
                                        num += numberq1(i.hp);
                                        await i.die();
                                    }
                                    if (numx) {
                                        while (num > 0) {
                                            const num1 = Math.floor(5 * Math.random());
                                            num -= num1;
                                            await player.getEnemies().randomGet().damage(num1);
                                        }
                                    }
                                } else {
                                    const num = [1, 2, 3, 4].randomGet();
                                    switch (num) {
                                        case 1:
                                            {
                                                game.addFellowQ('HL_yuwei');
                                                game.addFellowQ('HL_yuwei');
                                                while (numx-- > 0) {
                                                    game.addFellowQ(`HL_xiaoyong${[1, 2, 3].randomGet()}`);
                                                }
                                            }
                                            break;
                                        case 2:
                                            {
                                                game.addFellowQ('HL_zhengchen');
                                                game.addFellowQ('HL_zhengchen');
                                                while (numx-- > 0) {
                                                    game.addFellowQ('HL_zhishi');
                                                }
                                            }
                                            break;
                                        case 3:
                                            {
                                                game.addFellowQ('HL_zhushi');
                                                game.addFellowQ('HL_zhushi');
                                            }
                                            break;
                                        case 4:
                                            {
                                                let numq = 2 * numx;
                                                while (numq-- > 0) {
                                                    game.addFellowQ('HL_fanren');
                                                }
                                            }
                                            break;
                                    }
                                }
                            },
                        },
                        // 勠力同心
                        // 锁定技,自身回合结束后,令所有士兵依次执行一个回合
                        // 士兵回合结束后,令自身执行一个额外的摸牌阶段与出牌阶段.
                        HL_tongxin: {
                            trigger: {
                                player: ['phaseAfter'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.players.some((q) => q.identity == 'zhong');
                            },
                            async content(event, trigger, player) {
                                for (const npc of game.players.filter((q) => q.identity == 'zhong')) {
                                    await npc.phase();
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
                                        return event.player.identity == 'zhong';
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
                        //锁定技,免疫王受到的伤害;造成伤害时,令王恢复等量体力
                        HL_fushi: {
                            trigger: {
                                global: ['damageBegin4'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.identity == 'zhu';
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
                                        return game.players.some((q) => q.identity == 'zhu');
                                    },
                                    async content(event, trigger, player) {
                                        const num = numberq1(trigger.num);
                                        for (const i of game.players.filter((q) => q.identity == 'zhu')) {
                                            i.recover(num);
                                        }
                                    },
                                },
                            },
                        },
                        // 镇恶
                        //锁定技,敌方角色结束阶段,若其本回合造成了伤害,你视作对其使用一张【杀】,期间其技能失效
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
                                trigger.player.addSkill('HL_zhene_1');
                                await player.useCard({ name: 'sha' }, trigger.player);
                                trigger.player.removeSkill('HL_zhene_1');
                            },
                            subSkill: {
                                1: {
                                    init(player) {
                                        if (!player.storage.skill_blocker) {
                                            player.storage.skill_blocker = [];
                                        }
                                        player.storage.skill_blocker.add('HL_zhene_1');
                                    },
                                    onremove(player) {
                                        if (player.storage.skill_blocker) {
                                            player.storage.skill_blocker.remove('HL_zhene_1');
                                        }
                                    },
                                    skillBlocker(skill) {
                                        return skill != 'HL_zhene_1';
                                    },
                                    mark: true,
                                    intro: {
                                        content(storage, player) {
                                            return '<li>镇恶:此杀结算期间武将牌上的技能失效';
                                        },
                                    },
                                },
                            },
                        },
                        // 蒙光
                        //锁定技,王的出牌阶段结束后,恢复一点体力
                        HL_mengguang: {
                            trigger: {
                                global: ['phaseUseEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.identity == 'zhu';
                            },
                            async content(event, trigger, player) {
                                trigger.player.recover();
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者骁勇  神  6体力(刀/枪/弓随机之一)
                        // 金刀
                        //锁定技,你使用伤害牌指定敌方角色时,将其所有牌移出游戏直到此回合结束,你对牌数小于你的敌方角色造成的伤害翻倍
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
                        //锁定技,你使用或打出【杀】/【闪】时,获得对方一张牌,你可以将一张基本牌当做【杀】/【闪】使用或打出
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
                                    return ui.create.dialog('金枪', [game.qcard(player).filter((q) => ['sha', 'shan'].includes(q[2])), 'vcard']);
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
                        //锁定技,你使用【杀】指定敌方角色时,你本回合每使用过一个花色的牌,此【杀】伤害+1.
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
                                trigger.baseDamage = 1 + num;
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————铁骨铮臣  神  24体力
                        // 铮骨
                        //锁定技,受到伤害/体力流失/体力调整时,改为失去一点体力
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
                        //锁定技,准备阶段,你随机展示三张普通锦囊牌,并令王选择其中一张使用之;若王拒绝使用,你失去一点体力
                        HL_qieyan: {
                            trigger: {
                                player: ['phaseZhunbeiBegin'],
                            },
                            forced: true,
                            filter(event, player) {
                                return game.players.some((q) => q.identity == 'zhu');
                            },
                            async content(event, trigger, player) {
                                const cards = Array.from(ui.cardPile.childNodes)
                                    .filter((c) => get.type(c) == 'trick')
                                    .randomGets(3);
                                if (cards.length) {
                                    game.cardsGotoOrdering(cards);
                                    player.showCards(cards);
                                    const boss = game.players.find((q) => q.identity == 'zhu');
                                    const {
                                        result: { links },
                                    } = await boss.chooseButton(['选择其中一张使用之', cards]).set('ai', (button) => get.value(button.link));
                                    if (links && links[0]) {
                                        boss.chooseUseTarget(links[0], true, false, 'nodistance');
                                    } else {
                                        player.loseHp();
                                    }
                                }
                            },
                        },
                        // 祛暗
                        //锁定技,王的回合结束时,你弃置所有敌方角色各一张牌
                        HL_quan: {
                            trigger: {
                                global: ['phaseEnd'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.identity == 'zhu';
                            },
                            async content(event, trigger, player) {
                                for (const npc of player.getEnemies()) {
                                    await player.discardPlayerCard(npc, 'he', true);
                                }
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————兴国志士  神  4体力
                        // 图兴
                        // 锁定技,每回合限一次,你使用锦囊牌时,所有友方角色各摸一张牌
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
                        // 锁定技,王对敌方角色造成伤害时,此伤害翻倍
                        HL_zhenguo: {
                            trigger: {
                                global: ['damageBefore'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.source?.identity == 'zhu' && event.player.isEnemiesOf(player);
                            },
                            async content(event, trigger, player) {
                                trigger.num = numberq1(trigger.num) * 2;
                            },
                        },
                        //——————————————————————————————————————————————————————————————————————————————————————————————————凡人之愿  群  3体力
                        // 凡愿
                        // 锁定技,体力减少时,进行一次判定;若不为♥️,防止之
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
                        // 每阶段每种牌名限一次,你可以将一张牌当做任意牌使用,然后摸一张牌
                        HL_pozhu: {
                            init(player) {
                                player.storage.HL_pozhu = [];
                            },
                            enable: ['chooseToUse', 'chooseToRespond'],
                            hiddenCard(player, name) {
                                return player.countCards('hes') && !player.storage.HL_pozhu.includes(name);
                            },
                            filter: (event, player) => player.countCards('hes') && game.qcard(player).some((q) => !player.storage.HL_pozhu.includes(q[2])),
                            chooseButton: {
                                dialog(event, player) {
                                    return ui.create.dialog('破竹', [game.qcard(player).filter((q) => !player.storage.HL_pozhu.includes(q[2])), 'vcard']);
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
                                        popname: true,
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
                                respondTao: true,
                                respondwuxie: true,
                                respondSha: true,
                                respondShan: true,
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
                        // 锁定技,其他角色使用的锦囊牌对你无效,你每回合首次受到伤害时,防止之,然后摸两张牌
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
                        // 锁定技,每名角色准备阶段,你卜算x(x为该角色座次数);免疫王受到的伤害;你退场后,王召唤的士兵生命值翻倍,对敌方角色造成的伤害翻倍
                        HL_dingli: {
                            trigger: {
                                global: ['damageBegin4'],
                            },
                            forced: true,
                            filter(event, player) {
                                return event.player.identity == 'zhu';
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
                                        return game.players.some((q) => q.identity == 'zhu');
                                    },
                                    async content(event, trigger, player) {
                                        const boss = game.players.find((q) => q.identity == 'zhu');
                                        boss.addSkill('HL_dingli_3');
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
                                        return event.source?.identity == 'zhong' && event.player.isEnemiesOf(player);
                                    },
                                    async content(event, trigger, player) {
                                        trigger.num = numberq1(trigger.num) * 2;
                                    },
                                },
                            },
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
                        //——————————————————————————————————————————————————————————————————————————————————————————————————丰乐亭侯  神  120体力
                        HL_fengletinghou: '丰乐亭侯',
                        HL_pozhu: '破竹',
                        HL_pozhu_info: '每阶段每种牌名限一次,你可以将一张牌当做任意牌使用,然后摸一张牌',
                        HL_jingxie: '精械',
                        HL_jingxie_info: '准备阶段,你随机使用每种类型强化装备各一张;从牌堆/弃牌堆中随机获得2基本3锦囊',
                        HL_qianxun: '谦逊',
                        HL_qianxun_info: '锁定技,其他角色使用的锦囊牌对你无效,你每回合首次受到伤害时,防止之,然后摸两张牌',
                        HL_dingli: '定历',
                        HL_dingli_info: '锁定技,每名角色准备阶段,你卜算x(x为该角色座次数);免疫王受到的伤害;你退场后,王召唤的士兵生命值翻倍,对敌方角色造成的伤害翻倍',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————凡人之愿  群  3体力
                        HL_fanren: '凡人之愿',
                        HL_fanyuan: '凡愿',
                        HL_fanyuan_info: '锁定技,体力减少时,进行一次判定;若不为♥️,防止之',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————国之柱石  神  200体力
                        HL_zhushi: '国之柱石',
                        HL_zhenguo: '镇国',
                        HL_zhenguo_info: '锁定技,王对敌方角色造成伤害时,此伤害翻倍',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————兴国志士  神  4体力
                        HL_zhishi: '兴国志士',
                        HL_tuxing: '图兴',
                        HL_tuxing_info: '锁定技,每回合限一次,你使用锦囊牌时,所有友方角色各摸一张牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————铁骨铮臣  神  24体力
                        HL_zhengchen: '铁骨铮臣',
                        HL_zhenggu: '铮骨',
                        HL_zhenggu_info: '锁定技,受到伤害/体力流失/体力调整时,改为失去一点体力',
                        HL_qieyan: '切言',
                        HL_qieyan_info: '锁定技,准备阶段,你随机展示三张普通锦囊牌,并令王选择其中一张使用之;若王拒绝使用,你失去一点体力',
                        HL_quan: '祛暗',
                        HL_quan_info: '锁定技,王的回合结束时,你弃置所有敌方角色各一张牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者骁勇  神  6体力(刀/枪/弓随机之一)
                        HL_xiaoyong1: '王者骁勇',
                        HL_xiaoyong2: '王者骁勇',
                        HL_xiaoyong3: '王者骁勇',
                        HL_jindao: '金刀',
                        HL_jindao_info: '锁定技,你使用伤害牌指定敌方角色时,将其所有牌移出游戏直到此回合结束,你对牌数小于你的敌方角色造成的伤害翻倍',
                        HL_jinqiang: '金枪',
                        HL_jinqiang_info: '锁定技,你使用或打出【杀】/【闪】时,获得对方一张牌,你可以将一张基本牌当做【杀】/【闪】使用或打出',
                        HL_jingong: '金弓',
                        HL_jingong_info: '锁定技,你使用【杀】指定敌方角色时,你本回合每使用过一个花色的牌,此【杀】伤害+1',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————王者御卫  神  30体力
                        HL_yuwei: '王者御卫',
                        HL_fushi: '拂士',
                        HL_fushi_info: '锁定技,免疫王受到的伤害;造成伤害时,令王恢复等量体力',
                        HL_zhene: '镇恶',
                        HL_zhene_info: '锁定技,敌方角色结束阶段,若其本回合造成了伤害,你视作对其使用一张【杀】,期间其技能失效',
                        HL_mengguang: '蒙光',
                        HL_mengguang_info: '锁定技,王的出牌阶段结束后,恢复一点体力',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————封印之王座  神  500.0体力
                        HL_wangzuo: '封印之王座',
                        HL_shengzhe: '圣者荣光',
                        HL_shengzhe_info: '锁定技,你拥有90%减伤和50限伤;体力值低于10%时,你召唤丰乐亭侯',
                        HL_wangdao: '王道权御',
                        HL_wangdao_info: '每轮开始时,若场上没有士兵,随机召唤一批次士兵<br>若场上有士兵,令所有士兵自爆<br>每自爆一个士兵的一点体力,对随机敌方单位造成1点伤害<br>批次1<br>王左右出现王者御卫,玩家两侧出现王者骁勇<br>批次2<br>王左右出现铁骨铮臣,玩家两侧出现兴国志士<br>批次3<br>王左右出现国之柱石<br>批次4<br>玩家两侧出现两个凡人之愿',
                        HL_tongxin: '勠力同心',
                        HL_tongxin_info: '锁定技,自身回合结束后,令所有士兵依次执行一个回合<br>士兵回合结束后,令自身执行一个额外的摸牌阶段与出牌阶段',
                        //————————————————————————————————————————————博卓卡斯替·圣卫铳骑
                        HL_shengwei: '博卓卡斯替·圣卫铳骑',
                        HL_quanyu: '劝谕',
                        HL_quanyu_info: '<span class="Qmenu">锁定技,</span>敌方角色使用伤害牌时只能指定你为目标,且其进入濒死状态时需额外使用一张回复类实体牌',
                        HL_zhaohu: '照护',
                        HL_zhaohu_info: '<span class="Qmenu">锁定技,</span>受到与你距离为2及其以上的敌方角色的伤害至多为1;敌方角色受到你造成的伤害之后直到下回合之前其造成和受到的伤害+1',
                        //————————————————————————————————————————————奎隆·魔诃萨埵权化
                        HL_kuilong: '奎隆·魔诃萨埵权化',
                        HL_chengjie: '惩戒',
                        HL_chengjie_info: '<span class="Qmenu">锁定技,</span>当你使用负收益牌指定敌方角色时,该牌额外结算四次',
                        //————————————————————————————————————————————特雷西斯·黑冠尊主
                        HL_heiguanzunzhu: '特雷西斯·黑冠尊主',
                        HL_zhengfu: '征服',
                        HL_zhengfu_info: '<span class="Qmenu">锁定技,</span>你视为拥有技能【无双】,【铁骑】,【破军】,【强袭】',
                        //————————————————————————————————————————————曼弗雷德
                        HL_manfuleide: '曼弗雷德',
                        HL_junshixunlian: '军事训练',
                        HL_junshixunlian_info: '<span class="Qmenu">锁定技,</span>①你视为装备【先天八卦阵】<br>②造成伤害时有50%替换为随机属性伤害<br>③自身受到【杀】的伤害后此技能失效直到本轮结束',
                        //————————————————————————————————————————————阿米娅·炉芯终曲 血量:1000/1000 势力:神
                        HL_amiya: '阿米娅·炉芯终曲',
                        HL_buyingcunzai: '不应存在之人',
                        HL_buyingcunzai_info: '<span class="Qmenu">锁定技,</span>①免疫体力上限减少与体力值调整,拥有50%减伤<br>②当血量低于50%时,获得无敌状态【当体力值减少时防止之】直到本轮结束',
                        HL_chuangyi: '仅剩的创意',
                        HL_chuangyi_info: '<span class="Qmenu">锁定技,</span>①游戏开始时你获得3枚<仅剩的创意>,将场上所有角色势力锁定为<神>,并令敌方角色获得<束缚>状态,直到你造成伤害<br>②每轮开始时或造成伤害/体力变化后,你获得等量的<仅剩的创意>并摸等量的牌<br>③你的手牌上限等于<仅剩的创意>数<br>④准备阶段,你消耗3枚<仅剩的创意>对敌方角色各造成1点伤害',
                        HL_jintouchongxian: '尽头重现',
                        HL_jintouchongxian_info: '<span class="Qmenu">锁定技,</span>准备阶段若你<仅剩的创意>达到30枚以上,消耗30枚<仅剩的创意>随机召唤一位随从加入战斗,每名随从限一次.随从除武将牌上技能外皆视为拥有<贵乱>',
                        HL_guiluan: '贵乱',
                        HL_guiluan_info: '<span class="Qmenu">锁定技,</span>当你使用【杀】、【决斗】、【过河拆桥】、【顺手牵羊】和【逐近弃远】时,若场上有未成为目标的敌方角色,你令这些角色也成为此牌目标',
                        HL_cunxuxianzhao: '存续先兆',
                        HL_cunxuxianzhao_info: '蓄力技(0/10),结束阶段,若蓄力值已满消耗所有蓄力值随机令一名敌方角色所有技能失效并死亡.每名随从死亡时增加五点蓄力值',
                        HL_wuzhong: '无终',
                        HL_wuzhong_info: '觉醒技,当你即将死亡时取消之并将体力值回复至上限,获得技能【黑冠余威】,【无言的期盼】和【永恒存续】',
                        HL_heiguan: '黑冠余威',
                        HL_heiguan_info: '<span class="Qmenu">锁定技,</span>①当体力值首次回复至上限后立即令敌方角色失去一半体力值<br>②每次消耗<仅剩的创意>时伤害+X(X为1~7的随机值,存活的角色越多此伤害随机加成越低)',
                        HL_qipan: '无言的期盼',
                        HL_qipan_info: '<span class="Qmenu">锁定技,</span>结束阶段开始时,若场上有其他角色的手牌数大于/小于你,则令所有其他角色将手牌数弃置/摸至与你相等',
                        HL_yongheng: '永恒存续',
                        HL_yongheng_info: '<span class="Qmenu">锁定技,</span>①自身为BOSS且死亡后若场上仍有其他角色,则令所有角色死亡随后视其胜利<br>②自身不为BOSS且进入濒死状态时令其他角色失去所有体力值,然后你回复等量体力值并摸等量的牌(每局限一次)',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————李白
                        HL_李白: '李白',
                        醉诗: '醉诗',
                        醉诗_info: '每回合限两次,每轮开始时、体力值变化后,你视为使用一张<酒>并随机使用牌堆中一张伤害牌,然后你随机使用弃牌堆或处理区中一张伤害牌',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————许劭
                        HL_许劭: '许劭',
                        评鉴: '评鉴',
                        评鉴_info: '在很多时机,你都可以尝试运行一个对应时机技能的content',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————神之無雙
                        HL_BOSS: '神之無雙',
                        HL_BOSS_info: '神之無雙挑战模式<br>1.此模式有四个boss(無雙飞将/镇关魔将/焚城魔士/乱武毒士),每阶段抽取阶段数的boss登场,且boss按阶段解锁技能<br>2.boss体力值大于0时拒绝死亡,免疫除受伤害外扣减体力值,免疫翻面横置与移除,免疫扣减体力上限',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————無雙飞将
                        HL_lvbu: '無雙飞将',
                        HL_wushuang: '無雙',
                        HL_wushuang_info: '登场时,视作依次使用四张【杀】.锁定技,你使用【杀】指定目标时,令其武将牌上的技能失效且此【杀】需要x张【闪】来响应,此杀伤害提高x点,你使用的【杀】可以额外指定至多五个目标.(x为敌方角色数)',
                        HL_wumou: '无谋',
                        HL_wumou_info: '二阶段解锁,锁定技,你使用的除【决斗】以外的锦囊牌失效,使用的基本牌结算三次',
                        HL_jiwu: '极武',
                        HL_jiwu_info: '三阶段解锁,锁定技,你使用伤害牌指定目标后,令这些角色各失去一点体力',
                        HL_liyu: '利驭',
                        HL_liyu_info: '四阶段解锁,每名角色回合限一次,你使用伤害牌指定其后,摸四张牌,出牌阶段出杀次数+1,防止此牌对其造成的伤害,你下一次造成的伤害翻倍',
                        HL_shenwei: '神威',
                        HL_shenwei_info: '炼狱模式解锁,锁定技,其他角色准备阶段,你可以使用一张【杀】',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————镇关魔将
                        HL_huaxiong: '镇关魔将',
                        HL_yaowu: '耀武',
                        HL_yaowu_info: '登场时,展示所有敌方角色的手牌并弃置其中的伤害牌.锁定技,敌方角色使用伤害牌时,你取消所有目标,然后令此牌对你结算x次(x为此牌指定的目标数)',
                        HL_shiyong: '恃勇',
                        HL_shiyong_info: '二阶段解锁,锁定技,当你受到伤害后,你摸一张牌,然后可以将一张牌当做【杀】对伤害来源使用,若此【杀】造成了伤害,你弃置其一张牌',
                        HL_shizhan: '势斩',
                        HL_shizhan_info: '三阶段解锁,锁定技,敌方角色准备阶段,你摸三张牌,然后其视作依次对你使用两张【决斗】,你可以将一张黑色牌当做【杀】打出',
                        HL_yangwei: '扬威',
                        HL_yangwei_info: '四阶段解锁,锁定技,敌方角色出牌阶段开始时,其需选择一项:①本回合使用基本牌②本回合使用非基本牌.其执行另外一项后,你对其造成一点伤害',
                        HL_zhenguan: '镇关',
                        HL_zhenguan_info: '炼狱模式解锁,锁定技,当你成为一张基本牌或普通锦囊牌的目标时,你进行一次判定,若为黑色,此牌对你无效',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————抗性测试
                        HL_kangxing: '抗性测试',
                        HL_miaosha: '秒杀',
                        HL_miaosha_info: '清空对方技能并进行即死',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————焚城魔士
                        HL_liru: '焚城魔士',
                        HL_fencheng: '焚城',
                        HL_fencheng_info: '登场时,对所有敌方角色各造成三点火焰伤害.锁定技,准备阶段,连续进行四次判定,对所有敌方角色造成相当于判定结果中♥️️牌数点火焰伤害',
                        HL_juece: '绝策',
                        HL_juece_info: '二阶段解锁,锁定技,每名角色结束阶段,你令所有此回合失去过牌的角色各失去一点体力',
                        HL_mieji: '灭计',
                        HL_mieji_info: '三阶段解锁,锁定技,准备阶段,你展示一名敌方角色的手牌,弃置里面所有基本牌,获得其中所有锦囊牌',
                        HL_zhendi: '鸩帝',
                        HL_zhendi_info: '四阶段解锁,锁定技,其他角色准备阶段,你将一张【毒】从游戏外加入于其手牌中,有【毒】进入弃牌堆时,你下一次造成的伤害+1',
                        HL_dujiu: '毒酒',
                        HL_dujiu_info: '炼狱模式解锁,锁定技,游戏开始时,你将牌堆里所有【酒】替换为【毒】,然后将12张【毒】加入游戏,我方角色使用【毒】时,改为回复两点体力',
                        //——————————————————————————————————————————————————————————————————————————————————————————————————乱武毒士
                        HL_jiaxu: '乱武毒士',
                        HL_luanwu: '乱武',
                        HL_luanwu_info: '登场时,为所有敌方角色附加三层<重伤>效果(重伤:回复体力时,将回复值设定为0并移除一层<重伤>)<br>乱武:锁定技,准备阶段,你令所有敌方角色依次选择一项:①本回合无法使用【桃】,然后失去一点体力②对一名友方角色使用一张【杀】.选择结束后,你摸相当于选择①角色数量张牌,然后视作依次使用选择②角色数量张【杀】',
                        HL_wansha: '完杀',
                        HL_wansha_info: '二阶段解锁,锁定技,你的回合内,敌方角色回复体力后,若其不处于濒死状态,你令其失去一点体力,若其仍处于濒死状态,你令其获得一层<重伤>',
                        HL_weimu: '帷幕',
                        HL_weimu_info: '三阶段解锁,锁定技,我方角色受到的伤害至多为1,且每回合至多受到5次伤害',
                        HL_chengxiong: '惩雄',
                        HL_chengxiong_info: '四阶段解锁,锁定技,敌方角色使用于其摸牌阶段外获得的牌时,失去一点体力',
                        HL_duji: '毒计',
                        HL_duji_info: '炼狱模式解锁,锁定技,任意角色使用普通锦囊牌时,你进行一次判定,若为黑色,其失去一点体力,若为红色,你令一名角色回复一点体力',
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
                    info.group = '仙';
                    info.isZhugong = true;
                    info.trashBin = [`ext:火灵月影/image/${i}.jpg`];
                    info.dieAudios = [`ext:火灵月影/die/${i}.mp3`];
                }
                for (const i in QQQ.skill) {
                    const info = QQQ.skill[i];
                    info.nobracket = true;
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
                if (!lib.config.all.characters.includes('火灵月影')) {
                    lib.config.all.characters.push('火灵月影');
                }
                if (!lib.config.characters.includes('火灵月影')) {
                    lib.config.characters.push('火灵月影');
                }
                lib.translate['火灵月影_character_config'] = `火灵月影`;
                return QQQ;
            });
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
        content(config, pack) {
            lib.skill.bosshp = {
                init(player) {
                    const info = lib.character[player.name];
                    let maxhp = info.maxHp;
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
                    let qhp = info.hp;
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
                filter(event, player) {
                    return event.num > 0;
                },
                async content(event, trigger, player) {
                    player.success = true;
                    player.hp = player.hp - trigger.num;
                    player.update();
                    player.success = false;
                },
            };
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
                        let DRAW = 1;
                        Reflect.defineProperty(trigger, 'num', {
                            get() {
                                return DRAW;
                            },
                            set(value) {
                                if (value > DRAW) {
                                    DRAW = value;
                                }
                            },
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
                            Reflect.defineProperty(trigger, 'targets', {
                                get() {
                                    return player.getEnemies();
                                },
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
                    if (trigger.name == 'phaseDraw') {
                        let DRAW = 2;
                        Reflect.defineProperty(trigger, 'num', {
                            get() {
                                return DRAW;
                            },
                            set(value) {
                                game.log(`摸牌数由${DRAW}变为${value}`);
                                if (value > DRAW) {
                                    DRAW = value;
                                }
                            },
                        });
                        Reflect.defineProperty(trigger, 'finished', {
                            get() {
                                return trigger.step > 2;
                            },
                            set() { },
                        });
                    }
                },
            };
            lib.translate.bosshp = 'boss抗性';
            lib.translate.bosshp_info = '你的体力上限不会减少,免疫体力调整与体流,你具有翻面/横置/移除/死亡/封禁技能/移除技能抗性';
            lib.translate.bossfinish = 'boss抗性';
            lib.translate.bossfinish_info = '你的阶段与回合不会被跳过,你摸牌阶段摸的牌不会减少,你造成的伤害不能被减免,你使用的牌不能被无效且伤害牌指定所有敌方角色';
            lib.skill._HL_BOSS = {
                trigger: {
                    player: 'dieEnd',
                },
                forced: true,
                forceDie: true,
                mode: ['boss'],
                filter(event, player) {
                    return _status.HL_BOSS?.boss.every((q) => !game.players.includes(q)) && _status.HL_BOSS.num < 4;
                },
                async content(event, trigger, player) {
                    _status.HL_BOSS.boss = [];
                    _status.HL_BOSS.num++;
                    const list = _status.HL_BOSS.name.randomGets(_status.HL_BOSS.num);
                    let first;
                    for (const name of list) {
                        let bossx;
                        if (!first) {
                            first = true;
                            bossx = game.changeBossQ(name);
                        } else {
                            bossx = game.addFellowQ(name);
                        }
                        _status.HL_BOSS.boss.add(bossx);
                        bossx.skills = [];
                        const skills = lib.character[name].skills.slice(0, _status.HL_BOSS.num);
                        if (lib.config.extension_火灵月影_lianyu) {
                            skills.add(lib.character[name].skills.slice(-1));
                        }
                        game.$kangxing(bossx, name);
                        game.kangxing(bossx, skills);
                    }
                },
            };
            //—————————————————————————————————————————————————————————————————————————————gameStart
            lib.skill._HLQUANJU = {
                trigger: {
                    global: ['gameStart'],
                },
                silent: true,
                firstDo: true,
                _priority: 9999,
                filter: (event, player) => player == game.me,
                async content(event, trigger, player) {
                    if (player.hasSkill('醉诗') || player.name == 'HL_李白') {
                        game.playAudio('../extension/火灵月影/audio/醉诗2.mp3');
                        await game.HL_VIDEO('HL_李白');
                    } //李白动画
                },
            }; //只触发一次
            if (lib.boss) {
                lib.boss.HL_BOSS = {
                    chongzheng: false,
                    checkResult(player) {
                        if (_status.HL_BOSS.num < 4 || _status.HL_BOSS.boss.some((q) => game.players.includes(q))) {
                            if (player == game.boss) {
                                return false;
                            }
                        } else {
                            game.checkResult();
                        }
                    },
                    init() {
                        _status.HL_BOSS = {
                            num: 1,
                            name: ['HL_liru', 'HL_jiaxu', 'HL_huaxiong', 'HL_lvbu'],
                            boss: [game.boss],
                        };
                        const name = _status.HL_BOSS.name.randomGet();
                        game.boss.init(name);
                        game.boss.skills = [];
                        const skills = lib.character[name].skills.slice(0, _status.HL_BOSS.num);
                        if (lib.config.extension_火灵月影_lianyu) {
                            skills.add(lib.character[name].skills.slice(-1));
                        }
                        game.$kangxing(game.boss, name);
                        game.kangxing(game.boss, skills);
                    },
                };
                lib.boss.HL_amiya = {
                    chongzheng: false, //所有人死后几轮复活,填0不会复活//boss不会自动添加重整
                    checkResult(player) {
                        if (player == game.boss) {
                            return false;
                        }
                    },
                    init() {
                        game.$kangxing(game.boss, 'HL_amiya');
                        game.kangxing(game.boss);
                    },
                };
                lib.boss.HL_wangzuo = {
                    chongzheng: false, //所有人死后几轮复活,填0不会复活//boss不会自动添加重整
                    checkResult(player) {
                        if (player == game.boss && player.hp > 0) {
                            return false;
                        }
                    },
                    init() {
                        game.$kangxing(game.boss, 'HL_wangzuo');
                        game.kangxing(game.boss);
                    },
                };
            }
            if (lib.config.extension_火灵月影_关闭本体BOSS) {
                for (const i of ['boss_hundun', 'boss_qiongqi', 'boss_taotie', 'boss_taowu', 'boss_zhuyin', 'boss_xiangliu', 'boss_zhuyan', 'boss_bifang', 'boss_yingzhao', 'boss_qingmushilian', 'boss_qinglong', 'boss_mushengoumang', 'boss_shujing', 'boss_taihao', 'boss_chiyanshilian', 'boss_zhuque', 'boss_huoshenzhurong', 'boss_yanling', 'boss_yandi', 'boss_baimangshilian', 'boss_baihu', 'boss_jinshenrushou', 'boss_mingxingzhu', 'boss_shaohao', 'boss_xuanlinshilian', 'boss_xuanwu', 'boss_shuishengonggong', 'boss_shuishenxuanming', 'boss_zhuanxu', 'boss_zhuoguiquxie', 'boss_nianshou_heti', 'boss_nianshou_jingjue', 'boss_nianshou_renxing', 'boss_nianshou_ruizhi', 'boss_nianshou_baonu', 'boss_baiwuchang', 'boss_heiwuchang', 'boss_luocha', 'boss_yecha', 'boss_niutou', 'boss_mamian', 'boss_chi', 'boss_mo', 'boss_wang', 'boss_liang', 'boss_qinguangwang', 'boss_chujiangwang', 'boss_songdiwang', 'boss_wuguanwang', 'boss_yanluowang', 'boss_bianchengwang', 'boss_taishanwang', 'boss_dushiwang', 'boss_pingdengwang', 'boss_zhuanlunwang', 'boss_mengpo', 'boss_dizangwang', 'boss_lvbu1', 'boss_lvbu2', 'boss_lvbu3', 'boss_caocao', 'boss_guojia', 'boss_zhangchunhua', 'boss_zhenji', 'boss_liubei', 'boss_zhugeliang', 'boss_huangyueying', 'boss_pangtong', 'boss_zhouyu', 'boss_caiwenji', 'boss_zhangjiao', 'boss_zuoci', 'boss_diaochan', 'boss_huatuo', 'boss_dongzhuo', 'boss_sunce']) {
                    lib.config.mode_config.boss[`${i}_boss_config`] = false;
                };
                game.saveConfig(`mode_config`, lib.config.mode_config);
            }
        },
        config: {
            群聊: {
                name: '<a href="https://qm.qq.com/q/SsTlU9gc24"><span class="Qmenu">【火灵月影】群聊: 771901025</span></a>',
                clear: true,
            },
            lianyu: {
                name: '<span class="Qmenu">挑战炼狱模式</span>',
                intro: '开启后,神之無雙增加技能',
                init: true,
            },
            死亡移除: {
                name: '<span class="Qmenu">死亡移除</span>',
                intro: '死亡后移出游戏',
                init: true,
            },
            关闭本体BOSS: {
                name: '<span class="Qmenu">关闭本体BOSS</span>',
                intro: '一键关闭本体BOSS',
                init: true,
            },
            武将全部可选: {
                name: '<span class="Qmenu">武将全部可选</span>',
                intro: '开启后,任何禁将、隐藏武将、BOSS武将都会变得可选,你甚至可以在BOSS模式用BOSS自己打自己',
                init: true,
            },
        },
        package: {
            intro: '一键给角色添加(死亡/封禁技能/移除技能/翻面/横置/移出游戏)抗性<br><br>本扩展自带抗性角色:李白/许劭/抗性测试,感兴趣的朋友可以挑战一下<br><br>致谢名单:<br>感谢咪咪狗提供构造函数修改思路<br>感谢云念与苏见笑进行bug测试<br>感谢诗笺指出不足<br>感谢u提供扩展名字<br>感谢不能提及名字的某人不能提及内容的帮助',
            author: '潜在水里的火&&Iking',
            version: Infinity,
        },
    };
});
