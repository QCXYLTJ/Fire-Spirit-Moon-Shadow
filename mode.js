import { lib, game, ui, get, ai, _status } from '../../noname.js';
//—————————————————————————————————————————————————————————————————————————————车轮战模式
game.addMode(
    'chelunzhan',
    {
        async start(event) {
            lib.config.mode = 'chelunzhan';
            _status.mode = 'chelunzhan';
            game.prepareArena(2);
            game.me.identity = 'zhu';
            game.me.side = true;
            game.me.next.identity = 'fan';
            game.me.next.side = false;
            game.zhu = game.me;
            lib.init.onfree();
            for (const npc of game.players) {
                npc.getId();
                npc.node.identity.classList.remove('guessing');
                npc.identityShown = true;
                npc.ai.shown = 1;
                npc.setIdentity();
                if (npc == game.me) {
                    if (lib.config.mode_config.chelunzhan.随机选将) {
                        npc.characternum = 9;
                        const list = Object.keys(lib.character).randomGets(5);
                        const {
                            result: { links },
                        } = await npc.chooseButton(['选择首个出战武将', [list, 'character']], true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.init(links[0]);
                        }
                    } else {
                        const {
                            result: { links },
                        } = await npc.chooseButton(ui.create.characterDialog('选择十个出战武将'), 10, true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.characterlist = links;
                            const {
                                result: { links: links1 },
                            } = await npc.chooseButton(['选择首个出战武将', [npc.characterlist, 'character']], true).set('ai', (button) => Math.random());
                            if (links1 && links1[0]) {
                                npc.characterlist.remove(links1[0]);
                                npc.init(links1[0]);
                            }
                        }
                    }
                } else {
                    if (lib.config.mode_config.chelunzhan.随机选将) {
                        npc.characternum = 9;
                    } else {
                        npc.characterlist = Object.keys(lib.character).randomGets(9);
                    }
                    npc.init(Object.keys(lib.character).randomGet());
                }
            }
            await event.trigger('gameStart');
            await game.gameDraw(game.zhu, () => 4);
            game.phaseLoop(game.zhu);
        },
        game: {
            checkResult() {
                game.over(game.me.isAlive());
            },
        },
        element: {
            player: {
                async dieAfter() {
                    const player = this;
                    let name;
                    if (lib.config.mode_config.chelunzhan.随机选将) {
                        if (player.characternum > 0) {
                            const list = Object.keys(lib.character).randomGets(5);
                            const {
                                result: { links },
                            } = await player.chooseButton(['选择下一个出战武将', [list, 'character']], true).set('ai', (button) => Math.random());
                            if (links && links[0]) {
                                player.characternum--;
                                name = links[0];
                            }
                        }
                    } else {
                        if (player.characterlist?.length) {
                            const {
                                result: { links },
                            } = await player.chooseButton(['选择下一个出战武将', [player.characterlist, 'character']], true).set('ai', (button) => Math.random());
                            if (links && links[0]) {
                                player.characterlist.remove(links[0]);
                                name = links[0];
                            }
                        }
                    }
                    if (name) {
                        const boss = game.addPlayerQ(name);
                        if (game.me == player) {
                            game.me = boss;
                        }
                        boss.characternum = player.characternum;
                        boss.characterlist = player.characterlist;
                        boss.identity = player.identity;
                        boss.showIdentity();
                        game.removePlayer(player);
                    }
                    if (game.players.length < 2) {
                        game.checkResult();
                    }
                },
            },
        },
        get: {
            rawAttitude(from, to) {
                if (!from) return 0;
                if (!to) return 0;
                if (from.identity == to.identity) return 10;
                return -10;
            },
        },
        skill: {},
        translate: {
            zhu: '先',
            fan: '后',
            zhu2: '先手',
            fan2: '后手',
            chelunzhan: '车轮战',
        },
    },
    {
        translate: '车轮战',
        config: {
            intro: {
                name: '本模式两边各选10个将,每次选择一名武将出战,阵亡后继续挑选下一位武将出战,直到一边武将全部阵亡',
                frequent: true,
                clear: true,
            },
            随机选将: {
                name: '<span class=Qmenu>随机选将</span>',
                intro: '开启后,本模式选将逻辑改为————每次阵亡后从五个随机武将里面挑选一个出战',
                init: false,
                frequent: true,
            },
        },
    }
);
lib.mode.chelunzhan.splash = 'ext:火灵月影/image/chelunzhan.jpg';
//—————————————————————————————————————————————————————————————————————————————灵气复苏模式
game.addMode(
    'lingqifusu',
    {
        async start(event) {
            lib.config.mode = 'lingqifusu';
            _status.mode = 'lingqifusu';
            const num = Number(lib.config.mode_config.lingqifusu.单阵营人数) || 3;
            game.prepareArena(num * 3);
            const player1 = game.players.slice(0, num);
            const player2 = game.players.slice(num, num * 2);
            const player3 = game.players.slice(num * 2, num * 3);
            game.zhu = game.players.randomGet(); //随机一个先出牌的
            for (const i of player1) {
                i.identity = 'xian';
                i.side = 'xian';
            }
            for (const i of player2) {
                i.identity = 'mo';
                i.side = 'mo';
            }
            for (const i of player3) {
                i.identity = 'ling';
                i.side = 'ling';
            }
            lib.init.onfree();
            for (const npc of game.players) {
                npc.getId();
                npc.node.identity.classList.remove('guessing');
                npc.identityShown = true;
                npc.ai.shown = 1;
                npc.setIdentity();
                if (npc == game.me) {
                    if (lib.config.mode_config.lingqifusu.随机选将) {
                        const list = Object.keys(lib.character).randomGets(5);
                        const {
                            result: { links },
                        } = await npc.chooseButton(['选择出战武将', [list, 'character']], true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.init(links[0]);
                        }
                    } else {
                        const {
                            result: { links },
                        } = await npc.chooseButton(ui.create.characterDialog('选择出战武将'), true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.init(links[0]);
                        }
                    }
                } else {
                    npc.init(Object.keys(lib.character).randomGet());
                }
                npc.maxHp = 10 * npc.maxHp;
                npc.hp = 10 * npc.hp;
            }
            await event.trigger('gameStart');
            await game.gameDraw(game.zhu, () => 4);
            game.phaseLoop(game.zhu);
        },
        game: {
            checkResult() {
                game.over(game.players[0]?.identity == game.me.identity);
            },
        },
        element: {
            player: {
                dieAfter() {
                    if (game.players.map((q) => q.identity).unique().length > 1) {
                        return;
                    }
                    game.checkResult();
                },
                maxlingli() {
                    const player = this;
                    const jingjie = ['lianqi', 'zhuji', 'jindan', 'yuanying', 'huashen', 'lianxu', 'heti', 'dacheng', 'dujie', 'feisheng'];
                    const list = {
                        lianqi: 10,
                        zhuji: 30,
                        jindan: 60,
                        yuanying: 100,
                        huashen: 150,
                        lianxu: 210,
                        heti: 280,
                        dacheng: 360,
                        dujie: 450,
                        feisheng: 550,
                    };
                    if (!player.jingjie) {
                        player.jingjie = 'lianqi';
                    }
                    return list[player.jingjie];
                },
                async pojing() {
                    const player = this;
                    if (!player.jingjie) {
                        player.jingjie = 'lianqi';
                    }
                    if (player.jingjie == 'feisheng') {
                        return 'feisheng';
                    }
                    const jingjie = ['lianqi', 'zhuji', 'jindan', 'yuanying', 'huashen', 'lianxu', 'heti', 'dacheng', 'dujie', 'feisheng'];
                    const index = jingjie.indexOf(player.jingjie);
                    const skills = Object.keys(lib.skill).filter((i) => lib.translate[`${i}_info`]);
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
                        .set('prompt', `破境:请选择获得的技能`);
                    player.addSkillLog(control);
                    player.jingjie = jingjie[index + 1];
                    return player.jingjie;
                },
                jingjiechaochu(target) {
                    const player = this;
                    if (!player.jingjie) {
                        player.jingjie = 'lianqi';
                    }
                    if (!target.jingjie) {
                        target.jingjie = 'lianqi';
                    }
                    const jingjie = ['lianqi', 'zhuji', 'jindan', 'yuanying', 'huashen', 'lianxu', 'heti', 'dacheng', 'dujie', 'feisheng'];
                    const index1 = jingjie.indexOf(player.jingjie);
                    const index2 = jingjie.indexOf(target.jingjie);
                    return index1 - index2;
                },
            },
        },
        get: {
            rawAttitude(from, to) {
                if (!from) return 0;
                if (!to) return 0;
                if (from.identity == to.identity) return 10;
                return -10;
            },
        },
        skill: {
            // 任意角色体力值每增加1获得2灵力,体力值每扣减1失去1灵力,每获得1牌获得1灵力,每失去1牌失去0.5灵力,每造成一点伤害获得2灵力
            // 灵力可以增幅攻击力与防御力,境界低的攻击对境界高的修士会大幅衰减
            // 若当前灵力达到当前境界上限,则无法继续获得灵力
            // 出牌阶段限一次,你可以获得一个技能来突破瓶颈
            _lingqifusu: {
                trigger: {
                    player: ['gainEnd', 'loseEnd', 'changeHpEnd'],
                    source: ['damageEnd'],
                },
                filter(event, player) {
                    return player.countMark('_lingqifusu') < player.maxlingli();
                },
                forced: true,
                intro: {
                    content(storage, player) {
                        return `当前境界${get.translation(player.jingjie)}<br>当前灵力${storage}`;
                    },
                },
                async content(event, trigger, player) {
                    if (trigger.name == 'gain') {
                        player.addMark('_lingqifusu', trigger.cards.length);
                    } else if (trigger.name == 'lose') {
                        player.removeMark('_lingqifusu', trigger.cards.length * 0.5);
                    } else if (trigger.name == 'damage') {
                        player.addMark('_lingqifusu', trigger.num * 2);
                    } else {
                        if (trigger.num > 0) {
                            player.addMark('_lingqifusu', trigger.num * 2);
                        } else {
                            player.removeMark('_lingqifusu', -trigger.num);
                        }
                    }
                },
                subSkill: {
                    1: {
                        enable: 'phaseUse',
                        usable: 1,
                        filter(event, player) {
                            return player.countMark('_lingqifusu') >= player.maxlingli();
                        },
                        async content(event, trigger, player) {
                            player.pojing();
                        },
                        ai: {
                            order: 99,
                            result: {
                                player: 99,
                            },
                        },
                    },
                    2: {
                        trigger: {
                            player: ['damageBefore'],
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            let num = 100;
                            if (trigger.source && trigger.source.countMark('_lingqifusu')) {
                                num + trigger.source.countMark('_lingqifusu');
                            }
                            num - player.countMark('_lingqifusu');
                            if (num <= 0) {
                                trigger.cancel();
                            }
                            if (trigger.source) {
                                const chaochu = player.jingjiechaochu(trigger.source);
                                if (chaochu > 0) {
                                    num = num / Math.pow(2, chaochu);
                                }
                                if (chaochu < 0) {
                                    num = num * Math.pow(2, -chaochu);
                                }
                            }
                            trigger.num = Math.round(trigger.num * (num / 100));
                        },
                    },
                },
            },
        },
        translate: {
            xian: '仙',
            mo: '魔',
            ling: '灵',
            lingqifusu: '灵气复苏',
            _lingqifusu: '灵气复苏',
            _lingqifusu_info: '任意角色体力值每增加1获得2灵力,体力值每扣减1失去1灵力,每获得1牌获得1灵力,每失去1牌失去0.5灵力,每造成一点伤害获得2灵力<br>灵力可以增幅攻击力与防御力,境界低的攻击对境界高的修士会大幅衰减<br>若当前灵力达到当前境界上限,则无法继续获得灵力<br>出牌阶段限一次,你可以获得一个技能来突破瓶颈',
            lianqi: '炼气',
            zhuji: '筑基',
            jindan: '金丹',
            yuanying: '元婴',
            huashen: '化神',
            lianxu: '炼虚',
            heti: '合体',
            dacheng: '大乘',
            dujie: '渡劫',
            feisheng: '飞升',
        },
    },
    {
        translate: '灵气复苏',
        config: {
            intro: {
                name: '本模式有三个阵营<仙/魔/灵>,存活至最后的阵营获得胜利<br>本模式引入灵气机制,所有角色体力上限翻十倍<br>任意角色体力值每增加1获得2灵力,体力值每扣减1失去1灵力,每获得1牌获得1灵力,每失去1牌失去0.5灵力,每造成一点伤害获得2灵力<br>灵力可以增幅攻击力与防御力,境界低的攻击对境界高的修士会大幅衰减<br>若当前灵力达到当前境界上限,则无法继续获得灵力<br>出牌阶段限一次,你可以获得一个技能来突破瓶颈<br>以下为境界与灵力上限对照表<br>境界 当前最大灵力<br>炼气——10<br>筑基——30<br>金丹——60<br>元婴——100<br>化神——150<br>炼虚——210<br>合体——280<br>大乘——360<br>渡劫——450<br>飞升——550',
                frequent: true,
                clear: true,
            },
            随机选将: {
                name: '<span class=Qmenu>随机选将</span>',
                intro: '开启后,本模式选将逻辑改为随机选将',
                init: false,
                frequent: true,
            },
            单阵营人数: {
                name: '<span class=Qmenu>单阵营人数</span>',
                intro: '控制单个阵营人员数量',
                init: '3',
                item: {
                    2: '<span class=Qmenu>2</span>',
                    3: '<span class=Qmenu>3</span>',
                    4: '<span class=Qmenu>4</span>',
                    5: '<span class=Qmenu>5</span>',
                    6: '<span class=Qmenu>6</span>',
                },
                frequent: true,
            },
        },
    }
);
lib.mode.lingqifusu.splash = 'ext:火灵月影/image/lingqifusu.jpg';
//—————————————————————————————————————————————————————————————————————————————击鼓传花模式
game.addMode(
    'jiguchuanhua',
    {
        async start(event) {
            lib.config.mode = 'jiguchuanhua';
            _status.mode = 'jiguchuanhua';
            game.prepareArena(8);
            const player1 = game.players.randomGets(4);
            const player2 = game.players.filter((q) => !player1.includes(q)); //随机座位
            _status.chuanhua = [player1[0], player2[0]];
            _status.long = 0;
            _status.hu = 0;
            game.zhu = game.players.randomGet(); //随机一个先出牌的
            for (const i of player1) {
                i.identity = 'long';
                i.side = true;
            }
            for (const i of player2) {
                i.identity = 'hu';
                i.side = false;
            }
            lib.init.onfree();
            for (const npc of game.players) {
                npc.getId();
                npc.node.identity.classList.remove('guessing');
                npc.identityShown = true;
                npc.ai.shown = 1;
                npc.setIdentity();
                if (npc == game.me) {
                    if (lib.config.mode_config.jiguchuanhua.随机选将) {
                        const list = Object.keys(lib.character).randomGets(5);
                        const {
                            result: { links },
                        } = await npc.chooseButton(['选择出战武将', [list, 'character']], true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.init(links[0]);
                        }
                    } else {
                        const {
                            result: { links },
                        } = await npc.chooseButton(ui.create.characterDialog('选择出战武将'), true).set('ai', (button) => Math.random());
                        if (links && links[0]) {
                            npc.init(links[0]);
                        }
                    }
                } else {
                    npc.init(Object.keys(lib.character).randomGet());
                }
            }
            await event.trigger('gameStart');
            await game.gameDraw(game.zhu, () => 4);
            game.phaseLoop(game.zhu);
        },
        game: {
            checkResult() {
                game.over(game.players[0]?.identity == game.me.identity);
            },
        },
        element: {
            player: {
                dieAfter() {
                    const player = this;
                    if (!game.players.includes(player) || player.isDead()) {
                        player.qrevive();
                    }
                },
            },
        },
        get: {
            rawAttitude(from, to) {
                if (!from) return 0;
                if (!to) return 0;
                if (from.identity == to.identity) return 10;
                return -10;
            },
        },
        skill: {
            // 每队的一号位回合开始时,若本队没有<花>,将牌堆顶一张牌作为<花>加入手牌
            _jiguchuanhua: {
                trigger: {
                    player: ['phaseBegin'],
                },
                forced: true,
                filter(event, player) {
                    return _status.chuanhua.includes(player) && player.getFriends(true).every((q) => !q.hasCard((c) => c.oriname, 'hs'));
                },
                async content(event, trigger, player) {
                    const card = get.cards()[0];
                    card.identity = player.identity;
                    card.oriname = card.name;
                    card.init([card.suit, card.number, 'hua']);
                    player.gain(card, 'gain2');
                },
                subSkill: {
                    // <花>进入弃牌堆时恢复原牌名,且失去者所在队伍弃置一半牌
                    // 若被失去的<花>原先所属队伍没有<花>,将牌堆顶一张牌作为<花>,加入一号位手牌
                    1: {
                        trigger: {
                            player: ['loseAfter'],
                        },
                        forced: true,
                        filter(event, player) {
                            if (event.cards?.some((c) => c.oriname && get.position(c, true) == 'd')) {
                                return true;
                            }
                            return false;
                        },
                        async content(event, trigger, player) {
                            for (const npc of player.getFriends(true)) {
                                await npc.randomDiscard('he', Math.ceil(npc.countCards('he') / 2));
                            }
                            for (const card of trigger.cards.filter((c) => c.oriname && get.position(c) == 'd')) {
                                card.init([card.suit, card.number, card.oriname]);
                                delete card.oriname;
                                const boss = _status.chuanhua.find((q) => q.identity == card.identity);
                                if (boss && boss.getFriends(true).every((q) => !q.hasCard((c) => c.oriname, 'hs'))) {
                                    const cardx = get.cards()[0];
                                    cardx.oriname = cardx.name;
                                    cardx.identity = boss.identity;
                                    cardx.init([cardx.suit, cardx.number, 'hua']);
                                    boss.gain(cardx, 'gain2');
                                }
                            }
                        },
                    },
                    // 任意角色体力值减少时防止之,改为随机弃置一张牌
                    2: {
                        trigger: {
                            player: ['changeHpBegin', 'dieBegin', 'die'],
                        },
                        forced: true,
                        forceDie: true,
                        filter(event, player) {
                            if (name == 'changeHpBegin') {
                                return event.num < 0;
                            }
                            return true;
                        },
                        async content(event, trigger, player) {
                            if (event.triggername == 'die') {
                                player.qrevive();
                            } else {
                                trigger.cancel();
                                player.randomDiscard('he');
                            }
                        },
                    },
                },
            },
        },
        card: {
            // 花
            // 回合限一次,你可以对下一个友方角色使用,置入目标手牌区内
            // 当<花>从一号位经过后续队友重新回到一号位手中后,称为完整传递一次
            // 将<花>完整传递累计达到3次的队伍,获得游戏胜利
            hua: {
                fullimage: true,
                image: 'ext:火灵月影/image/hua.jpg',
                type: 'hua',
                enable: true,
                filterTarget(c, p, t) {
                    const players = game.players.filter((q) => q.side == p.side);
                    return t === players[(players.indexOf(p) + 1) % players.length];
                },
                selectTarget: 1,
                async content(event, trigger, player) {
                    event.target.gain(event.cards, 'gain2');
                    if (_status.chuanhua.includes(event.target)) {
                        const identity = event.target.identity;
                        _status[identity]++;
                        player.$skill(`${get.translation(identity)}队传花${_status[identity]}次`);
                        if (_status[identity] > 2) {
                            game.over(game.me.identity == identity);
                        }
                    }
                },
                ai: {
                    order: 50,
                    result: {
                        target: 5,
                    },
                    basic: {
                        useful: 20,
                        value: 20,
                    },
                },
            },
        },
        translate: {
            long: '龙',
            hu: '虎',
            hua: '花',
            hua_info: '出牌阶段,你可以对下一个友方角色使用,置入目标手牌区内<br>当<花>从一号位经过后续队友重新回到一号位手中后,称为完整传递一次<br>将<花>完整传递累计达到3次的队伍,获得游戏胜利',
            jiguchuanhua: '击鼓传花',
            _jiguchuanhua: '击鼓传花',
            _jiguchuanhua_info: '每队的一号位回合开始时,若本队没有<花>,将牌堆顶一张牌作为<花>加入手牌<br><花>进入弃牌堆时恢复原牌名,且失去者所在队伍弃置一半牌<br>若被失去的<花>原先所属队伍没有<花>,将牌堆顶一张牌作为<花>,加入一号位手牌<br>任意角色体力值减少时防止之,改为随机弃置一张牌',
        },
    },
    {
        translate: '击鼓传花',
        config: {
            intro: {
                name: '本模式4人一队,总计两队<br>每队的一号位回合开始时,若本队没有<花>,将牌堆顶一张牌作为<花>加入手牌<br><花>进入弃牌堆时恢复原牌名,且失去者所在队伍弃置一半牌<br>若被失去的<花>原先所属队伍没有<花>,将牌堆顶一张牌作为<花>,加入一号位手牌<br>任意角色体力值减少时防止之,改为随机弃置一张牌<br>花<br>出牌阶段,你可以对下一个友方角色使用,置入目标手牌区内<br>当<花>从一号位经过后续队友重新回到一号位手中后,称为完整传递一次<br>将<花>完整传递累计达到3次的队伍,获得游戏胜利',
                frequent: true,
                clear: true,
            },
            随机选将: {
                name: '<span class=Qmenu>随机选将</span>',
                intro: '开启后,本模式选将逻辑改为随机选将',
                init: false,
                frequent: true,
            },
        },
    }
);
lib.mode.jiguchuanhua.splash = 'ext:火灵月影/image/jiguchuanhua.jpg';
//—————————————————————————————————————————————————————————————————————————————山河图模式
window.shanhe = {
    shanhetustart() {
        // 主界面 山河册 选择城池 开始/继续战斗
        if (shanhe.beijing2) {
            shanhe.beijing2.remove();
        }
        shanhe.beijing1 = document.createElement('div');
        shanhe.beijing1.id = 'shanhetu1';
        document.body.appendChild(shanhe.beijing1);
        for (const i in shanhe.chengchi) {
            const chengchiinfo = shanhe.chengchi[i];
            const chengchi = document.createElement('div');
            chengchi.className = 'chengchi';
            chengchi.style.top = `${40 + 40 * Math.random()}%`;
            chengchi.style.left = `${10 + 80 * Math.random()}%`;
            chengchi.style.backgroundImage = `url(extension/火灵月影/image/${i}.png)`;
            chengchi.name = i;
            if (i == shanhe.cur_chengchi) {
                if (shanhe.gongji) {
                    shanhe.gongji.remove();
                }
                shanhe.gongji = document.createElement('div');
                shanhe.gongji.className = 'gongji';
                chengchi.appendChild(shanhe.gongji);
            }
            if (chengchiinfo.tongguan) {
                chengchi.style.filter = 'grayscale(100%)';
            } else {
                chengchi.onclick = function () {
                    const chengchi = this;
                    shanhe.cur_chengchi = chengchi.name;
                    if (shanhe.gongji) {
                        shanhe.gongji.remove();
                    }
                    shanhe.gongji = document.createElement('div');
                    shanhe.gongji.className = 'gongji';
                    chengchi.appendChild(shanhe.gongji);
                };
            }
            shanhe.beijing1.appendChild(chengchi);
        }
        const start = document.createElement('div');
        start.className = 'startQ';
        start.innerHTML = '开始游戏';
        start.onclick = function () {
            if (!shanhe.cur_chengchi) {
                alert('请先选择要挑战的城池');
                return;
            }
            shanhe.chengchistart();
        };
        shanhe.beijing1.appendChild(start);
        if (!shanhe.cur_xuanjiang) {
            const xuanjiangkuang = document.createElement('div');
            xuanjiangkuang.id = 'divQ';
            shanhe.beijing1.appendChild(xuanjiangkuang);
            const list = Object.keys(lib.character).randomGets(5);
            for (const i of list) {
                const touxiang = ui.create.button(i, 'character');
                touxiang.classList.add('touxiangQ');
                touxiang.onclick = function () {
                    const touxiang = this;
                    shanhe.cur_xuanjiang = touxiang.link;
                    xuanjiangkuang.remove();
                };
                xuanjiangkuang.appendChild(touxiang);
            }
        }
    },
    // 商店 关卡选择 战法调整 技能栏 卡牌栏 装备栏 挑战过的关卡变灰色
    chengchistart() {
        shanhe.beijing1.remove();
        shanhe.beijing2 = document.createElement('div');
        shanhe.beijing2.id = 'shanhetu2';
        document.body.appendChild(shanhe.beijing2);
        const cur_chengchi = shanhe.chengchi[shanhe.cur_chengchi];
        for (const i in cur_chengchi) {
            const guankainfo = cur_chengchi[i];
            const guanka = document.createElement('div');
            guanka.className = 'guanka';
            guanka.style.backgroundImage = `url(extension/火灵月影/image/${i}.png)`;
            guanka.style.top = `${40 + 20 * Math.random()}%`;
            guanka.style.left = `${10 + 80 * Math.random()}%`;
            guanka.name = i;
            if (guankainfo.tongguan) {
                guanka.style.filter = 'grayscale(100%)';
            } else {
                guanka.onclick = function () {
                    const guanka = this;
                    shanhe.cur_guanka = guanka.name;
                    const guankazhanshi = document.createElement('div');
                    guankazhanshi.className = 'guankazhanshi';
                    shanhe.beijing2.appendChild(guankazhanshi);
                    const zhanshiboss = ui.create.button(guankainfo.boss1.name, 'character');
                    zhanshiboss.classList.add('touxiangQ');
                    guankazhanshi.appendChild(zhanshiboss);
                    const guankastart = document.createElement('div');
                    guankastart.className = 'guankastart';
                    guankastart.innerHTML = '挑战此关';
                    guankastart.onclick = function () {
                        guankazhanshi.remove();
                        shanhe.guankastart();
                    };
                    guankazhanshi.appendChild(guankastart);
                    const fanhui = document.createElement('div');
                    fanhui.className = 'backQ';
                    fanhui.innerHTML = '返回';
                    fanhui.onclick = function () {
                        guankazhanshi.remove();
                    };
                    guankazhanshi.appendChild(fanhui);
                };
            }
            shanhe.beijing2.appendChild(guanka);
        }
        const fanhui = document.createElement('div');
        fanhui.className = 'backQ';
        fanhui.innerHTML = '返回';
        fanhui.onclick = function () {
            shanhe.shanhetustart();
        };
        shanhe.beijing2.appendChild(fanhui);
    },
    // 进入关卡开始战斗
    async guankastart() {
        shanhe.beijing2.remove();
        const cur_guanka = shanhe.chengchi[shanhe.cur_chengchi][shanhe.cur_guanka];
        const bosslist = Object.keys(cur_guanka);
        game.prepareArena(bosslist.length + 1);
        game.zhu = game.me;
        lib.init.onfree();
        game.players.forEach((player, index, array) => {
            player.getId();
            if (player == game.me) {
                player.identity = 'zhu';
                player.side = true;
                player.init(shanhe.cur_xuanjiang);
            } else {
                const info = cur_guanka[bosslist[index - 1]];
                player.identity = 'fan';
                player.side = false;
                player.init(info.name);
                player.addSkill(info.skills);
                player.maxHp = info.maxHp;
                player.hp = info.hp;
                player.hujia = info.hujia;
            }
            player.node.identity.classList.remove('guessing');
            player.identityShown = true;
            player.ai.shown = 1;
            player.setIdentity();
        });
        shanhe.gameStart = _status.event.trigger('gameStart');
        await shanhe.gameStart;
        shanhe.gameDraw = game.gameDraw(game.zhu, () => 4);
        await shanhe.gameDraw;
        shanhe.zhongzhi = false;
        shanhe.phaseLoop = game.phaseLoop(game.zhu);
        await shanhe.phaseLoop;
    },
    jiesuan(bool) {
        shanhe.zhongzhi = true;
        shanhe.gameDraw.finish();
        shanhe.phaseLoop.finish();
        const players = game.players.concat(game.dead);
        for (const i of players) {
            game.removePlayer(i);
        }
        ui.me.remove();
        ui.mebg.remove();
        ui.handcards1Container.remove();
        ui.handcards2Container.remove();
        for (const i of Array.from(ui.arena.childNodes)) {
            if (i.classList.contains('center')) {
                i.remove();
            }
        } //清空中央区卡牌
        if (bool) {
            const chengchiinfo = shanhe.chengchi[shanhe.cur_chengchi];
            const guankainfo = chengchiinfo[shanhe.cur_guanka];
            guankainfo.tongguan = true;
            let alltongguan = true;
            for (const i in chengchiinfo) {
                if (!chengchiinfo[i].tongguan) {
                    alltongguan = false;
                }
            }
            if (alltongguan) {
                chengchiinfo.tongguan = true;
                shanhe.shanhetustart();
                return;
            }
        }
        shanhe.chengchistart();
    },
    chengchi: {
        chengchi1: {
            guanka1: {
                boss1: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
                boss2: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
            },
            guanka2: {
                boss1: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
                boss2: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
            },
        },
        chengchi2: {
            guanka1: {
                boss1: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
                boss2: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
            },
            guanka2: {
                boss1: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
                boss2: {
                    name: 'guojia',
                    sex: 'female',
                    skills: ['zhaxiang', 'ranshang'],
                    hujia: 1,
                    maxHp: 1,
                    hp: 1,
                },
            },
        },
    },
};
game.addMode(
    'shanhetu',
    {
        // 点将 城池选择 挑战过的城池变灰色
        async start() {
            lib.config.mode = 'shanhetu';
            _status.mode = 'shanhetu';
            shanhe.shanhetustart();
        },
        game: {
            checkResult() {
                if (game.players[0]?.side == game.me.side) {
                    shanhe.jiesuan(true);
                } else {
                    shanhe.jiesuan(false);
                }
            },
        },
        element: {
            player: {
                dieAfter() {
                    if (game.players.map((q) => q.side).unique().length > 1) {
                        return;
                    }
                    game.checkResult();
                },
            },
            content: {
                async phaseLoop(event, trigger, player) {
                    let num = 1,
                        current = player;
                    while (current.seatNum === 0) {
                        current.seatNum = num;
                        current = current.next;
                        num++;
                    }
                    while (true) {
                        if (game.players.includes(event.player)) {
                            lib.onphase.forEach((i) => i());
                            const phase = event.player.phase();
                            event.next.remove(phase);
                            let isRoundEnd = false;
                            if (lib.onround.every((i) => i(phase, event.player))) {
                                isRoundEnd = _status.roundSkipped;
                                if (_status.isRoundFilter) {
                                    isRoundEnd = _status.isRoundFilter(phase, event.player);
                                } else if (event.player == _status.roundStart) {
                                    isRoundEnd = true;
                                }
                                if (isRoundEnd && _status.globalHistory.some((i) => i.isRound)) {
                                    game.log();
                                    await event.trigger('roundEnd');
                                }
                            }
                            event.next.push(phase);
                            await phase;
                        }
                        await event.trigger('phaseOver');
                        if (shanhe.zhongzhi) {
                            break;
                        }
                        let findNext = (current) => {
                            let players = game.players
                                .slice(0)
                                .concat(game.dead)
                                .sort((a, b) => parseInt(a.dataset.position) - parseInt(b.dataset.position));
                            let position = parseInt(current.dataset.position);
                            for (let i = 0; i < players.length; i++) {
                                if (parseInt(players[i].dataset.position) > position) {
                                    return players[i];
                                }
                            }
                            return players[0];
                        };
                        event.player = findNext(event.player);
                    }
                },
            },
        },
        get: {
            rawAttitude(from, to) {
                if (!from) return 0;
                if (!to) return 0;
                if (from.identity == to.identity) return 10;
                return -10;
            },
        },
        skill: {
            // 【资源流】[总数7/35][普通2/11][稀有2/14][史诗2/6][传说1/4]:商店可无限刷新
            // 资源流	普通	赌徒Ⅰ	通过战斗获得的铜币将在50%-200%内随机
            // 普通200铜币	回收	在战斗外,当你的装备被顶替时,你可以获得200铜币
            // 普通	会员Ⅰ	你可以消耗100铜币刷新商店,可刷新1次
            // 普通	慧黠	选择【卡牌奖励】时,候选项从三个变为四个
            // 普通	家财万贯	开始剧本时,你获得200铜币
            // 普通	决斗店铺	商店有20%几率刷新出更高品质的技能
            // 普通	守财奴	游戏开始时,你铜币大于300,你的手牌上限+2
            // 普通	守财奴Ⅱ	游戏开始时,你铜币大于500,你的初始手牌+2
            // 普通	守财奴Ⅲ	游戏开始时,你铜币大于1000,你的摸牌数+2
            // 普通	物资店铺	商店有20%几率刷新出更高品质的手牌和装备
            // 普通	战争店铺	商店有20%几率刷新出更高品质的战法
            // 稀有300铜币	补货	集市中购买后立即刷新同位置商品
            // 稀有	打秋风	通过战斗获取的铜币增加20%
            // 稀有	赌徒Ⅱ	通过战斗获得的铜币将在0%-300%内随机
            // 稀有	家财万贯Ⅱ	开始剧本时,你获得300铜币
            // 稀有	利滚利	每场战斗后,你的总铜币数量增加5%
            // 稀有	谋略过人	选择【战法奖励】时,候选项从三个变为四个
            // 稀有	日行千里	每个章节,你可以额外行动1次
            // 稀有	商品+1	商店每类商品展示数量+1
            // 稀有	思维敏捷	选择【技能奖励】时,候选项从三个变为四个
            // 稀有	王牌战法	在精英战斗获得奖励时,额外获得一个稀有战法
            // 稀有	王牌战技	在首领战斗获得奖励时,额外获得一个史诗技能
            // 稀有	卧龙图	你将更容易获得你所在流派的战法
            // 稀有	议价Ⅰ	集市购买时降低10%铜币消耗
            // 稀有	蒸蒸日上	通过战斗关卡时,有20%几率获得更高一级的战法和技能奖励
            // 史诗500铜币	会员Ⅱ	你可以消耗100铜币刷新商店,可刷新5次
            // 史诗	集市霸王	在集市中购买时价格将不再递增
            // 史诗	家财万贯Ⅲ	开始剧本时,你获得400铜币
            // 史诗	群狼之争	后续普通关卡都将变为精英关卡,包括对应奖励
            // 史诗	守财奴Ⅳ	游戏开始时,你铜币大于1500,你的伤害+1
            // 史诗	议价Ⅱ	集市购买时降低20%铜币消耗
            // 传说700铜币	家财万贯Ⅳ	开始剧本时,你获得500铜币
            // 传说	利滚利Ⅱ	每场战斗后,你的总铜币数量增加10%
            // 传说	日行千里Ⅱ	每个章节,你可以额外行动2次
            // 传说	商品+2	商店每类商品展示数量+2
            // 【过牌流】[总数7/28][普通2/5][稀有2/12][史诗2/8][传说1/3]:手牌少于8时候补满8
            // 过牌流	普通	筹备	游戏开始时,你获得1张随机手牌
            // 普通	多多益善	每回合你第5次摸牌后,你摸1张牌
            // 普通	手到擒来	每回合你使用第7张牌后,你摸1张牌
            // 普通	未雨绸缪	仅首领战中,你随机获得2张初始手牌
            // 普通	招募后勤	初始手牌-2,摸牌数+1
            // 稀有	策定天下	出牌阶段限1次,当锦囊牌造成伤害后,摸1张牌
            // 稀有	筹备Ⅱ	游戏开始时,你获得2张随机手牌
            // 稀有	多多益善Ⅱ	每回合你第3次摸牌后,你摸1张牌
            // 稀有	二生三	【无中生有】额外摸1张牌
            // 稀有	后发先至	摸牌阶段,你的摸牌数-1;你的回合结束时,你摸3张牌
            // 稀有	锦囊计	手牌上限+X(X为本回合摸牌阶段摸牌数的一半)
            // 稀有	摸牌Ⅰ	摸牌阶段,你的摸牌数+1
            // 稀有	神龙摆尾	你每摸9张卡牌,你对随机敌方造成1点伤害
            // 稀有	手到擒来Ⅱ	每回合你使用第5张牌后,你摸1张牌
            // 稀有	未雨绸缪Ⅱ	仅首领战中,你随机获得3张初始手牌
            // 稀有	援助	回合结束时,你摸1张牌
            // 稀有	招募后勤Ⅱ	初始手牌-1,摸牌数+1
            // 史诗	策定天下Ⅱ	出牌阶段限1次,当锦囊牌造成伤害后,摸2张牌
            // 史诗	筹备Ⅲ	游戏开始时,你获得3张随机手牌
            // 史诗	木牛流马	你的摸牌阶段,你额外摸2张牌,手牌上限-1
            // 史诗	神龙摆尾Ⅱ	你每摸6张卡牌,你对随机敌方造成1点伤害
            // 史诗	手到擒来Ⅲ	每回合你使用第6张牌后,你摸2张牌
            // 史诗	未雨绸缪Ⅲ	仅首领战中,你随机获得4张初始手牌
            // 史诗	援助Ⅱ	回合结束时,你摸2张牌
            // 史诗	招募后勤Ⅲ	初始手牌-2,摸牌数+2
            // 传说	多多益善Ⅲ	每回合你第3次摸牌后,你摸2张牌
            // 传说	摸牌Ⅱ	摸牌阶段,你的摸牌数+2
            // 传说	援助Ⅲ	回合结束时,你摸3张牌
            // 【多刀流】[总数6/13][普通0/1][稀有2/5][史诗2/4][传说2/3]:出杀次数无限
            // 多刀流	普通	潜龙	每有一个已解锁的空技能槽,则出杀次数+2
            // 稀有	淬血	你每轮【杀】首次造成伤害后摸1张牌
            // 稀有	二连击	你的出牌阶段,你的出杀次数+1
            // 稀有	拂衣去杀	你的回合开始时,你获得1张【杀】
            // 稀有	双刃	每轮,你的首张【杀】至多能额外选择1个目标
            // 稀有	铸刀	你使用【杀】后可以至多重铸1张牌
            // 史诗	淬血Ⅱ	你每轮【杀】首次造成伤害后摸2张牌
            // 史诗	三板斧	你的每第3张【杀】伤害+1
            // 史诗	双刃Ⅱ	每轮,你的首张【杀】至多能额外选择2个目标
            // 史诗	铸刀Ⅱ	你使用【杀】后可以至多重铸2张牌
            // 传说	三板斧Ⅱ	你的每第3张【杀】伤害+2
            // 传说	三连击	你的出牌阶段,你的出杀次数+2
            // 传说	偷袭	♠️️【杀】无次数限制
            // 【伤害流】[总数7/15][普通1/3][稀有1/2][史诗3/5][传说2/5]:所有伤害+1
            // 伤害流	普通	关刀之脊	♦️️【杀】无距离限制
            // 普通	远击技	造成伤害时,若你与其距离大于1,此伤害+1
            // 普通	重击技	对敌方造成伤害一次大于等于3点时,摸1张牌
            // 稀有	虎骨酒	每回合,你可以额外使用1次【酒】
            // 稀有	雷火势Ⅰ	每回合限1次,你使用的第1张属性【杀】伤害+1
            // 史诗	当头一棒	每轮,你的首张【杀】伤害+1
            // 史诗	拂衣去锁	你的回合开始时,你获得1张【铁索连环】
            // 史诗	横江锁	【铁索连环】能指定任意个目标
            // 史诗	技艺Ⅰ	当你的技能直接造成伤害时,此伤害+1
            // 史诗	醉拳	【酒】【杀】不能被抵消
            // 传说	当头一棒Ⅱ	每轮,你的首张【杀】伤害+2
            // 传说	关公刃	♥️️【杀】伤害+1
            // 传说	虎骨酒Ⅱ	每回合,你可以额外使用2次【酒】
            // 传说	技艺Ⅱ	当你的技能直接造成伤害时,此伤害+2
            // 传说	雷火势Ⅱ	每回合限1次,你使用的第1张属性【杀】伤害+2
            // 【卖血流】[总数6/19][普通1/6][稀有0/1][史诗3/6][传说2/6]:回复体力时+1
            // 卖血流	普通	奋进	当体力大于2点,回合开始时失去1点体力并摸2张牌
            // 普通	破釜沉舟	回合外受到伤害一次大于等于3点时,对伤害来源造成等量同属性伤害.
            // 普通	铁布衫	游戏开始时,你获得1点护甲
            // 普通	稳定承载	手牌上限固定为8
            // 普通	狭路相逢	受到【决斗】伤害后回复1点体力
            // 普通	药理	每回合首次回复体力时,额外回复1点
            // 稀有	体魄Ⅰ	游戏开始时,你增加1点体力上限并回复等量体力
            // 史诗	拂衣去桃	你的回合开始时,你获得1张【桃】
            // 史诗	护甲Ⅰ	每轮开始时,你获得1点护甲
            // 史诗	弱反馈	受到1点伤害后,摸一张牌
            // 史诗	体魄Ⅱ	游戏开始时,你增加2点体力上限并回复等量体力
            // 史诗	卧薪尝胆	回合外每受到1次伤害,下回合出杀次数+1
            // 史诗	药理	回复体力时,额外回复1点
            // 传说	奋进Ⅱ	当体力大于4点,回合开始时失去1点体力并摸1张牌
            // 传说	荆棘甲	每次受到伤害后对伤害来源造成1点伤害
            // 传说	偏转甲	每次受到伤害后对随机敌方造成1点伤害
            // 传说	体魄Ⅲ	游戏开始时,你增加3点体力上限并回复等量体力
            // 传说	药理	每回合前3次回复体力时,额外回复1点
            // 传说	药理Ⅱ	回复体力时,额外回复2点
            // 【队友流】[总数5/10][普通1/1][稀有2/5][史诗1/3][传说1/1]:队友共享你的等阶效果(最低3阶效果)
            // 队友流	普通	队初	你的所有队友初始手牌+2
            // 稀有	队甲	你的所有队友护甲+3
            // 稀有	丰收年	你使用的【五谷丰登】仅友方角色可以获得牌
            // 稀有	羁绊	场上每存在一名队友,你的出杀次数+1
            // 稀有	结盟	你使用的【桃园结义】友方角色回复双倍体力
            // 稀有	兄弟会	开始剧本时,你获得1名普通队友
            // 史诗	队牌	你的所有队友摸牌数+2
            // 史诗	队体	你的所有队友体力+3
            // 史诗	兄弟会Ⅱ	开始剧本时,你获得1名精英队友
            // 传说	战场急救	队友阵亡后,下一轮开始时复活队友
            // 【残血流】[总数5/16][普通1/4][稀有2/6][史诗2/3][传说0/3]:每回合首次濒死时回复到1体力值
            // 残血流	普通	藏桃户	【桃】不计入手牌上限
            // 普通	狂暴	当你的体力值不大于2时,你造成的伤害+1
            // 普通	狂暴Ⅲ	当你的体力值不大于3时,你摸牌数+1
            // 普通	皮囊	手牌上限+1
            // 稀有	拂衣去闪	你的回合开始时,你获得1张【闪】
            // 稀有	厚实Ⅰ	每轮你受到的首次伤害-1
            // 稀有	狂暴Ⅳ	当你的体力值不大于5时,你摸牌数+1
            // 稀有	皮囊Ⅱ	手牌上限+2
            // 稀有	信手拈来	你的手牌上限不因体力值改变而改变
            // 稀有	勇战Ⅰ	你离开濒死时,对所有敌方造成1点伤害
            // 史诗	好身法	【闪】不计入手牌上限
            // 史诗	厚实Ⅱ	每轮你前2次受到的伤害-1
            // 史诗	狂暴Ⅱ	当你的体力值不大于3时,你造成的伤害+1
            // 传说	护甲Ⅱ	每轮开始时,你获得2点护甲
            // 传说	皮囊Ⅲ	手牌上限+5
            // 传说	勇战Ⅱ	你离开濒死时,对所有敌方造成2点伤害
            // 【后期流】[总数5/12][普通2/5][稀有2/4][史诗1/2][传说0/1]:每过一轮则首张杀伤害+1
            // 后期流	普通	布阵Ⅱ	从第5轮开始,你的摸牌数+1
            // 普通	布阵Ⅲ	从第7轮开始,你的摸牌数+1
            // 普通	愈战愈勇Ⅲ	从第7轮开始,你的【杀】造成的伤害+1
            // 普通	战斗学习Ⅱ	从第4轮开始,你的出杀+1
            // 普通	战斗学习Ⅲ	从第7轮开始,你的出杀+1
            // 稀有	布阵	从第3轮开始,你的摸牌数+1
            // 稀有	铁布衫Ⅱ	游戏开始时,你获得2点护甲
            // 稀有	愈战愈勇Ⅱ	从第5轮开始,你的【杀】造成的伤害+1
            // 稀有	战斗学习	从第3轮开始,你的出杀+1
            // 史诗	铁布衫Ⅲ	游戏开始时,你获得4点护甲
            // 史诗	愈战愈勇	从第3轮开始,你的【杀】造成的伤害+1
            // 传说	铁布衫Ⅳ	游戏开始时,你获得6点护甲
            // 【锦囊流】[总数7/23][普通0/0][稀有3/10][史诗3/7][传说1/6]:你的回合开始时,随机获得4张锦囊
            // 锦囊流	稀有	博闻Ⅰ	你的回合开始时,从牌堆中获得1张随机锦囊牌
            // 稀有	草船借箭	【无懈可击】获得抵消的锦囊牌
            // 稀有	单挑王	你使用的决斗可以选择多个目标
            // 稀有	拂衣去火	你的回合开始时,你获得1张【火攻】
            // 稀有	酣战	你使用的【决斗】对方需要2张杀
            // 稀有	妙手空空	你使用的【顺手牵羊】无距离限制
            // 稀有	巧取豪夺	你的【借刀杀人】成功时,伤害+1
            // 稀有	虚焰	【火攻】弃置改为展示
            // 稀有	蓄力箭	你使用的【万箭齐发】其他角色需要使用2张【闪】来响应
            // 稀有	眼线	【过河拆桥】时目标手牌可见
            // 史诗	博闻Ⅱ	你的回合开始时,从牌堆中获得2张随机锦囊牌
            // 史诗	趁其不备	你使用【过河拆桥】时,至多弃置目标2张牌
            // 史诗	拂衣去拆	你的回合开始时,你获得1张【过河拆桥】
            // 史诗	拂衣去顺	你的回合开始时,你获得1张【顺手牵羊】
            // 史诗	拂衣去决	你的回合开始时,你获得1张【决斗】
            // 史诗	绝对无懈	其他角色无法响应你的【无懈可击】
            // 史诗	强取豪夺	【顺手牵羊】时目标手牌可见
            // 传说	博闻Ⅲ	你的回合开始时,从牌堆中获得3张随机锦囊牌
            // 传说	趁其不备Ⅱ	你使用【过河拆桥】时,至多弃置目标3张牌
            // 传说	拂衣去万箭	你的回合开始时,你获得1张【万箭齐发】
            // 传说	拂衣去南蛮	你的回合开始时,你获得1张【南蛮入侵】
            // 传说	算无遗策	目标无法响应你的普通锦囊牌
            // 传说	阴阳术法	敌方无法响应你的伤害型锦囊牌
            // 【非套装】[总数0/107][普通0/44][稀有0/28][史诗0/14][传说0/21]:无套装效果
            // 非套装	普通	兵反	你判定兵粮寸断时,判定效果反转(反转效果不可叠加)
            // 普通	搏命	手牌上限降低2,出杀次数+1
            // 普通	策定天下	出牌阶段限1次,当锦囊牌造成伤害后,摸2张牌
            // 普通	淬血Ⅲ	你每轮【杀】首次造成伤害后摸1张牌
            // 普通	胆量剥夺	敌方的出杀次数-1,最低为1
            // 普通	当头一棒	每轮,你的首张【杀】伤害+1
            // 普通	涤净	获得时,你可以指定移出身上的一个战法
            // 普通	赌术I	你的拼点牌点数+3(最大为K)
            // 普通	断粮草Ⅱ	敌方摸牌数-1,最低为2
            // 普通	队友杀	你的所有队友出杀次数+1
            // 普通	二连击	你的出牌阶段,你的出杀次数+1
            // 普通	虎骨酒	每回合,你可以额外使用1次【酒】
            // 普通	化甲	若你没有【防具】,进入战斗时装备随机【防具】
            // 普通	化刃	若你没有【武器】,进入战斗时装备随机【武器】,不带出战斗
            // 普通	及时雨	回合外失去最后一张手牌后,摸2张牌
            // 普通	急行军	摸牌阶段,你的摸牌数+1
            // 普通	近身术	你与其他角色的距离始终为1
            // 普通	空白绘卷	失去装备牌后,随机失去一张牌
            // 普通	牢固装备	你的装备不能被弃置
            // 普通	乐转	你判定乐不思蜀时,判定效果反转(反转效果不可叠加)
            // 普通	雷火势Ⅰ	你使用的第1张属性【杀】伤害+1
            // 普通	粮草储备	游戏开始时,你回复1点体力
            // 普通	烈变	从第6轮开始,你的锦囊和技能造成的伤害+1
            // 普通	妙技I	每回合首张锦囊造成的伤害+1
            // 普通	妙技II	每回合前2张锦囊造成的伤害+1
            // 普通	内讧	敌方互相造成伤害时,伤害+1
            // 普通	弱袭	你的手牌小于当前体力时,你造成的伤害+1
            // 普通	三板斧	你的每第3张【杀】伤害+1
            // 普通	双刃	每轮,你的首张【杀】至多能额外选择1个目标
            // 普通	搜刮Ⅰ	当你击杀其他角色后,你回复1点体力值
            // 普通	随军辎重	随军辎重:手牌上限+3
            // 普通	体魄Ⅳ	游戏开始时,你增加1点体力上限并回复等量体力
            // 普通	体魄Ⅴ	游戏开始时,你增加1点体力上限并回复等量体力
            // 普通	铁布衫	获得1点护甲
            // 普通	稳定体质	你的体力上限固定为7,无法通过任何途径改变体力值上限
            // 普通	稳定后勤	摸牌阶段摸牌数固定为5
            // 普通	稳定进攻	回合内出杀次数固定为5
            // 普通	无限	你的技能槽+1(上限不变)
            // 普通	血战Ⅲ	体力上限-3(最低为1),每轮开始时回复1点体力
            // 普通	一鼓作气	游戏开始时,你获得1点护甲
            // 普通	应急策略	回合外成为敌方角色锦囊牌唯一目标,随机弃置来源2张牌
            // 普通	有备无患	游戏开始时,你获得1张随机手牌
            // 普通	远谋Ⅰ	第3轮你的回合开始时,你回复2点体力
            // 普通	铸刀	你使用【杀】后可以至多重铸1张牌
            // 稀有	搬运	你的回合开始时,从随机敌方手牌区获得1张牌
            // 稀有	传承	开局时,三选一获得一次稀有的技能
            // 稀有	胆量剥夺	敌方的出杀次数-1,最低为1
            // 稀有	赌术II	你的拼点牌点数+6(最大为K)
            // 稀有	断粮草Ⅰ	敌方摸牌数-1,最低为2
            // 稀有	二生三	【无中生有】额外摸1张牌
            // 稀有	反刺	每回合首次受到伤害后对所有敌方造成1点伤害
            // 稀有	衡锋I	回合内首次造成的伤害+1,回合外首次受到的伤害+1
            // 稀有	化宝	若你没有【宝物】,进入战斗时装备随机【宝物】
            // 稀有	精于谋略	你手牌数量少于4,你的【杀】伤害+1
            // 稀有	潦草绘卷	你的非锁定技触发并结算后,其失效至你下个回合开始时
            // 稀有	雷鸣	所有角色在判定阶段都要进行一次【闪电】判定
            // 稀有	雷震Ⅰ	战斗开始时,对全场所有角色造成1点雷属性伤害(触发1次)
            // 稀有	烈变Ⅱ	从第4轮开始,你的锦囊和技能造成的伤害+1
            // 稀有	谋命	每轮,你的锦囊牌首次造成的伤害改为降低其等量体力上限
            // 稀有	双掠	你使用的<顺手牵羊>可额外结算一次
            // 稀有	搜刮Ⅱ	当你击杀其他角色后,你回复2点体力值
            // 稀有	体魄	增加1点体力上限并回复等量体力
            // 稀有	铁布衫Ⅱ	获得2点护甲
            // 稀有	稳定士气	您的所有伤害值固定为2
            // 稀有	仙缘	你遇到奇遇时将会更幸运
            // 稀有	血战Ⅰ	体力上限-1(最低为1),每轮开始时回复1点体力
            // 稀有	血战Ⅱ	体力上限-2(最低为1),每轮开始时回复2点体力
            // 稀有	血战Ⅰ	体力上限-1(最低为1),每轮开始时回复1点体力
            // 稀有	应急方案	回合外成为敌方角色基本牌唯一目标,随机弃置来源1张牌
            // 稀有	应急战术	回合外成为敌方角色锦囊牌唯一目标,随机弃置来源1张牌
            // 稀有	远谋Ⅱ	第3轮你的回合开始时,你回复3点体力
            // 稀有	增寿I	体力上限+1(不改变当前体力)
            // 史诗	拔刀术	若上一轮你未造成任何伤害,则你本轮造成的所有伤害+1
            // 史诗	衡锋II	回合内首次造成的伤害+2,回合外首次受到的伤害+2
            // 史诗	精于谋略Ⅱ	你手牌数量少于6,你的【杀】伤害+1
            // 史诗	雷震Ⅱ	战斗开始时,对全场所有角色造成2点雷属性伤害(触发1次)
            // 史诗	蒲元之助	开始剧本时,你获得1件蒲元装备
            // 史诗	士气剥夺	所有敌方的体力上限-1,最低为1
            // 史诗	噬血I	回复体力时,摸1张牌
            // 史诗	搜刮Ⅲ	当你击杀其他角色后,你回复4点体力值
            // 史诗	剔甲术	对护甲造成双倍伤害
            // 史诗	体魄Ⅱ	增加2点体力上限并回复等量体力
            // 史诗	削命	每轮,你的【杀】首次造成的伤害改为降低其等量体力上限
            // 史诗	勇战Ⅲ	你离开濒死时,对所有敌方造成3点伤害
            // 史诗	远谋Ⅲ	第2轮你的回合开始时,你回复2点体力
            // 史诗	增寿II	体力上限+2(不改变当前体力)
            // 传说	拔刀术Ⅱ	若上一轮造成的伤害小于3,则你本轮造成的所有伤害+1
            // 传说	苍生绘卷	在本次征程中,你可以额外重生1次并中止当前结算进入你的回合.
            // 传说	打基础Ⅰ	局外手牌每增加3张,游戏开始额外获得1张手牌
            // 传说	打基础Ⅱ	局外手牌每增加2张,游戏开始额外获得1张手牌
            // 传说	打基础Ⅲ	局外手牌每增加1张,游戏开始额外获得1张手牌
            // 传说	隔山打牛	你对其他人造成伤害时,无视其护甲
            // 传说	关公刃	♥️️【杀】伤害+1
            // 传说	技艺Ⅲ	当你的技能直接造成伤害时,此伤害+3
            // 传说	烈变Ⅲ	从第2轮开始,你的锦囊和技能造成的伤害+1
            // 传说	逆袭	对体力上限高于你的目标伤害+1
            // 传说	蒲元之助Ⅱ	开始剧本时,你获得2件蒲元装备
            // 传说	体魄Ⅲ	增加3点体力上限并回复等量体力
            // 传说	铁布衫Ⅲ	获得4点护甲
            // 传说	蓄势	本回合没出杀,则下回合杀伤害+1(最多+1)
            // 传说	血刃	回复体力时,对随机敌方造成1点伤害
            // 传说	血战Ⅱ	体力上限-2(最低为1),每轮开始时回复2点体力
            // 传说	血战Ⅲ	体力上限-3(最低为1),每轮开始时回复3点体力
            // 传说	药理Ⅱ	每回合首次回复体力时,额外回复2点
            // 传说	药理Ⅱ	每回合前3次回复体力时,额外回复2点
            // 传说	一忘皆空	武将初始技能可被替换
            // 传说	应急战略	回合外成为敌方角色使用牌唯一目标,随机弃置来源1张牌
        },
        card: {},
        translate: {},
    },
    {
        translate: '山河图',
        config: {
            intro: {
                name: '山河图',
                frequent: true,
                clear: true,
            },
        },
    }
);
lib.mode.shanhetu.splash = 'ext:火灵月影/image/shanhetu.jpg';
