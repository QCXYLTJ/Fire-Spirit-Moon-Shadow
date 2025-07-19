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
                        boss.side = player.side;
                        boss.node.identity.classList.remove('guessing');
                        boss.identityShown = true;
                        boss.ai.shown = 1;
                        boss.setIdentity();
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
    // 初始页面 点将 城池选择 开始/继续战斗 挑战过的城池变灰色————————————山河册战法
    shanhetustart() {
        if (shanhe.beijing2) {
            shanhe.beijing2.remove();
        }
        shanhe.beijing1 = document.createElement('div');
        shanhe.beijing1.id = 'shanhetu1';
        document.body.appendChild(shanhe.beijing1);
        for (const i in lib.config.shanhe.chengchi) {
            const chengchiinfo = lib.config.shanhe.chengchi[i];
            const chengchi = document.createElement('div');
            chengchi.className = 'chengchi';
            chengchi.style.top = `${30 + 40 * Math.random()}%`;
            chengchi.style.left = `${10 + 80 * Math.random()}%`;
            chengchi.style.backgroundImage = `url(extension/火灵月影/image/${i}.png)`;
            chengchi.name = i;
            if (i == lib.config.shanhe.cur_chengchi) {
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
                    lib.config.shanhe.cur_chengchi = chengchi.name;
                    game.saveConfig('shanhe', lib.config.shanhe);
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
            if (!lib.config.shanhe.cur_chengchi) {
                alert('请先选择要挑战的城池');
                return;
            }
            shanhe.chengchistart();
        };
        shanhe.beijing1.appendChild(start);
        if (!lib.config.shanhe.cur_xuanjiang) {
            shanhe.xuanjiang();
        } else {
            shanhe.dianjiang();
        }
    },
    // 大厅页面 关卡选择 挑战过的关卡变灰色
    chengchistart() {
        shanhe.beijing1.remove();
        shanhe.beijing2 = document.createElement('div');
        shanhe.beijing2.id = 'shanhetu2';
        document.body.appendChild(shanhe.beijing2);
        //—————————————————————————————————————————————————————关卡选择
        const cur_chengchi = lib.config.shanhe.chengchi[lib.config.shanhe.cur_chengchi];
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
                    lib.config.shanhe.cur_guanka = guanka.name;
                    game.saveConfig('shanhe', lib.config.shanhe);
                    const guankazhanshi = document.createElement('div');
                    guankazhanshi.className = 'guankazhanshi';
                    shanhe.beijing2.appendChild(guankazhanshi);
                    for (const x in guankainfo) {
                        const info = guankainfo[x];
                        const name = info.name;
                        const bosszhanshi = document.createElement('div');
                        bosszhanshi.className = 'bosszhanshi';
                        guankazhanshi.appendChild(bosszhanshi);
                        bosszhanshi.oncontextmenu = function () {
                            ui.click.charactercard(name, null, null, true, bosszhanshi);
                        };
                        const bosstitle = document.createElement('div');
                        bosstitle.innerHTML = get.translation(name);
                        bosstitle.className = 'bosstitle';
                        bosszhanshi.appendChild(bosstitle);
                        const bossbox = document.createElement('div');
                        bossbox.className = 'bossbox';
                        bossbox.setBackground(name, 'character');
                        bosszhanshi.appendChild(bossbox);
                        const bossinfo = document.createElement('div');
                        bossinfo.innerHTML = `额外护甲值:${info.hujia}<br>额外体力值:${info.maxHp}<br>额外技能:<br>${get.translation(info.skills)}`;
                        bossinfo.className = 'bossinfo';
                        bosszhanshi.appendChild(bossinfo);
                    }
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
        //—————————————————————————————————————————————————————返回按钮
        const fanhui = document.createElement('div');
        fanhui.className = 'backQ';
        fanhui.innerHTML = '返回';
        fanhui.onclick = function () {
            shanhe.shanhetustart();
        };
        shanhe.beijing2.appendChild(fanhui);
        //—————————————————————————————————————————————————————集市
        shanhe.jishi();
        //—————————————————————————————————————————————————————<战法/技能/装备>调整
        shanhe.tiaozheng();
    },
    // 进入关卡开始战斗
    async guankastart() {
        shanhe.beijing2.remove();
        const cur_guanka = lib.config.shanhe.chengchi[lib.config.shanhe.cur_chengchi][lib.config.shanhe.cur_guanka];
        const bosslist = Object.keys(cur_guanka);
        game.prepareArena(bosslist.length + 1);
        game.zhu = game.me;
        lib.init.onfree();
        game.players.forEach((player, index, array) => {
            player.getId();
            if (player == game.me) {
                player.identity = 'zhu';
                player.side = true;
                player.init(lib.config.shanhe.cur_xuanjiang);
                if (lib.config.shanhe.cur_skill.length) {
                    player.addSkillLog(lib.config.shanhe.cur_skill);
                }
                if (lib.config.shanhe.cur_zhanfa.length) {
                    player.addAdditionalSkill('zhanfa', lib.config.shanhe.cur_zhanfa);
                    game.log(player, '获得战法', lib.config.shanhe.cur_zhanfa);
                }
                if (lib.config.shanhe.cur_maxHp > 0) {
                    player.maxHp += lib.config.shanhe.cur_maxHp;
                }
            } else {
                const info = cur_guanka[bosslist[index - 1]];
                player.identity = 'fan';
                player.side = false;
                player.init(info.name);
                player.addSkill(info.skills);
                player.maxHp += info.maxHp;
                player.hujia = info.hujia;
            }
            player.hp = player.maxHp;
            player.node.identity.classList.remove('guessing');
            player.identityShown = true;
            player.ai.shown = 1;
            player.setIdentity();
        });
        if (lib.config.shanhe.cur_friend.length) {
            for (const friend of lib.config.shanhe.cur_friend) {
                const fellow = game.me.addFellow(friend);
                game.log(game.me, '加入盟友', fellow);
            }
        }
        // 人员准备完毕
        _status.event.trigger('gameStart');
        if (lib.config.shanhe.cur_equip.length) {
            for (const equip of lib.config.shanhe.cur_equip) {
                await game.me.equip(game.createCard(equip));
            }
        }
        if (lib.config.shanhe.cur_card.length) {
            for (const card of lib.config.shanhe.cur_card) {
                await game.me.gain(game.createCard(card), 'gain2');
            }
        }
        shanhe.gameDraw = game.gameDraw(game.zhu, () => 4);
        await shanhe.gameDraw;
        shanhe.zhongzhi = false;
        shanhe.phaseLoop = game.phaseLoop(game.zhu);
        await shanhe.phaseLoop;
    },
    // 商店 购买<体力上限/手牌上限/战法/技能/初始手牌/装备/队友>
    jishi() {
        const jishi = document.createElement('div');
        jishi.className = 'jishi';
        jishi.onclick = function () {
            if (shanhe.jishikuang) {
                shanhe.jishikuang.remove();
                delete shanhe.jishikuang;
                return;
            }
            const jishikuang = document.createElement('div');
            jishikuang.className = 'jishikuang';
            shanhe.beijing2.appendChild(jishikuang); // 商品大框
            shanhe.jishikuang = jishikuang;
            const jishilist = document.createElement('div');
            jishilist.className = 'jishilist';
            jishikuang.appendChild(jishilist); // 商品类型栏
            const jishibox = document.createElement('div');
            jishibox.className = 'jishibox';
            jishikuang.appendChild(jishibox); // 商品框
            const leixinglist = ['zhanfa', 'skill', 'equip', 'card', 'friend'];
            for (const leixing of leixinglist) {
                const leixingpoint = document.createElement('div');
                leixingpoint.className = 'leixingpoint';
                jishilist.appendChild(leixingpoint); // 商品类型点
                leixingpoint.innerHTML = get.translation(leixing);
                leixingpoint.onclick = function () {
                    while (jishibox.firstChild) {
                        jishibox.firstChild.remove();
                    }
                    const list = shanhe[`${leixing}list`].randomGets(16);
                    for (const name of list) {
                        const shangpinpoint = document.createElement('div');
                        shangpinpoint.className = 'jianglipoint';
                        jishibox.appendChild(shangpinpoint);
                        const shangpintitle = document.createElement('div');
                        shangpintitle.className = 'jianglititle';
                        shangpinpoint.appendChild(shangpintitle);
                        shangpintitle.innerHTML = get.translation(leixing);
                        const shangpinbox = document.createElement('div');
                        shangpinbox.className = 'jianglibox';
                        shangpinbox.innerHTML = get.translation(name);
                        shangpinpoint.appendChild(shangpinbox);
                        if (leixing == 'friend') {
                            shangpinpoint.oncontextmenu = function () {
                                ui.click.charactercard(name, null, null, true, shangpinpoint);
                            };
                        } else {
                            shangpinpoint.oncontextmenu = function () {
                                const info = document.createElement('div');
                                info.className = 'jiangli-info';
                                document.body.appendChild(info);
                                info.innerHTML = get.translation(`${name}_info`);
                                setTimeout(() => {
                                    info.remove();
                                }, 2000);
                            };
                        }
                        if (['equip', 'card'].includes(leixing)) {
                            shangpinbox.setBackgroundImage(game.cardsrc(name, 'card'));
                        }
                        if ('friend' == leixing) {
                            shangpinbox.setBackground(name, 'character');
                        }
                        if ('zhanfa' == leixing) {
                            shangpinbox.setBackground(shanhe.zhanfamap[name], 'character');
                        }
                        shangpinpoint.jiage = 500;
                        shangpinpoint.onclick = function () {
                            if (jishibox.okkuang) {
                                jishibox.okkuang.remove();
                            }
                            const okkuang = document.createElement('div');
                            jishibox.okkuang = okkuang;
                            okkuang.className = 'okkuang';
                            okkuang.innerHTML = `是否花费500金币购买${get.translation(leixing)}--${get.translation(name)}`;
                            document.body.appendChild(okkuang);
                            const ok = document.createElement('div');
                            ok.innerHTML = '确认购买';
                            ok.className = 'ok-button';
                            okkuang.appendChild(ok);
                            ok.onclick = function () {
                                okkuang.remove();
                                const gongxi = document.createElement('div');
                                gongxi.className = 'gongxi';
                                document.body.appendChild(gongxi);
                                setTimeout(() => {
                                    gongxi.remove();
                                }, 2000);
                                if (lib.config.shanhe.cur_jinbi >= shangpinpoint.jiage) {
                                    lib.config.shanhe.cur_jinbi -= shangpinpoint.jiage;
                                    lib.config.shanhe[`cur_${leixing}`].push(name);
                                    game.saveConfig('shanhe', lib.config.shanhe);
                                    gongxi.innerHTML = '购买成功';
                                } else {
                                    gongxi.innerHTML = '金币不足';
                                }
                            };
                            const cancel = document.createElement('div');
                            cancel.innerHTML = '取消购买';
                            cancel.className = 'cancel-button';
                            okkuang.appendChild(cancel);
                            cancel.onclick = function () {
                                okkuang.remove();
                            };
                        };
                    }
                };
            }
        };
        shanhe.beijing2.appendChild(jishi);
    },
    // <战法/技能/装备/手牌/队友>展示与调整  出售<战法/技能/装备/手牌/队友> 金币显示 装备展示
    tiaozheng() {
        const tiaozhengkuang = document.createElement('div');
        tiaozhengkuang.className = 'tiaozhengkuang';
        shanhe.beijing2.appendChild(tiaozhengkuang);
        //——————————————————————————————————————————————————————————初始手牌展示
        const cardkuang = document.createElement('div');
        cardkuang.className = 'cardkuang';
        tiaozhengkuang.appendChild(cardkuang);
        for (const card of lib.config.shanhe.cur_card) {
            const cardpoint = document.createElement('div');
            cardpoint.className = 'cardpoint';
            cardpoint.innerHTML = get.translation(card);
            cardpoint.type = 'card';
            cardpoint.name = card;
            cardkuang.appendChild(cardpoint);
            cardpoint.oncontextmenu = function () {
                const info = document.createElement('div');
                info.className = 'jiangli-info';
                document.body.appendChild(info);
                info.innerHTML = get.translation(`${card}_info`);
                setTimeout(() => {
                    info.remove();
                }, 2000);
            };
            cardpoint.setBackgroundImage(game.cardsrc(card, 'card'));
        }
        //——————————————————————————————————————————————————————————当前战法展示
        const zhanfakuang = document.createElement('div');
        zhanfakuang.className = 'zhanfakuang';
        tiaozhengkuang.appendChild(zhanfakuang);
        for (const zhanfa of lib.config.shanhe.cur_zhanfa) {
            const zhanfapoint = document.createElement('div');
            zhanfapoint.className = 'zhanfapoint';
            zhanfapoint.innerHTML = get.translation(zhanfa);
            zhanfapoint.type = 'zhanfa';
            zhanfapoint.name = zhanfa;
            zhanfakuang.appendChild(zhanfapoint);
            zhanfapoint.oncontextmenu = function () {
                const info = document.createElement('div');
                info.className = 'jiangli-info';
                document.body.appendChild(info);
                info.innerHTML = get.translation(`${zhanfa}_info`);
                setTimeout(() => {
                    info.remove();
                }, 2000);
            };
            zhanfapoint.setBackground(shanhe.zhanfamap[zhanfa], 'character');
        }
        //——————————————————————————————————————————————————————————当前技能展示
        const skillkuang = document.createElement('div');
        skillkuang.className = 'skillkuang';
        tiaozhengkuang.appendChild(skillkuang);
        for (const skill of lib.config.shanhe.cur_skill) {
            const skillpoint = document.createElement('div');
            skillpoint.className = 'zhanfapoint';
            skillpoint.innerHTML = get.translation(skill);
            skillpoint.type = 'skill';
            skillpoint.name = skill;
            skillkuang.appendChild(skillpoint);
            skillpoint.oncontextmenu = function () {
                const info = document.createElement('div');
                info.className = 'jiangli-info';
                document.body.appendChild(info);
                info.innerHTML = get.translation(`${skill}_info`);
                setTimeout(() => {
                    info.remove();
                }, 2000);
            };
        }
        //——————————————————————————————————————————————————————————当前队友展示
        const friendkuang = document.createElement('div');
        friendkuang.className = 'friendkuang';
        tiaozhengkuang.appendChild(friendkuang);
        for (const friend of lib.config.shanhe.cur_friend) {
            const friendpoint = document.createElement('div');
            friendpoint.className = 'zhanfapoint';
            friendpoint.innerHTML = get.translation(friend);
            friendpoint.type = 'friend';
            friendpoint.name = friend;
            friendkuang.appendChild(friendpoint);
            friendpoint.oncontextmenu = function () {
                ui.click.charactercard(friend, null, null, true, friendpoint);
            };
            friendpoint.setBackground(friend, 'character');
        }
        //——————————————————————————————————————————————————————————当前选将头像展示
        const touxiangkuang = document.createElement('div');
        touxiangkuang.className = 'touxiangkuang';
        shanhe.beijing2.appendChild(touxiangkuang);
        touxiangkuang.setBackground(lib.config.shanhe.cur_xuanjiang, 'character');
        touxiangkuang.oncontextmenu = function () {
            ui.click.charactercard(lib.config.shanhe.cur_xuanjiang, null, null, true, touxiangkuang);
        };
        //——————————————————————————————————————————————————————————装备展示
        for (const equip of lib.config.shanhe.cur_equip) {
            const equippoint = document.createElement('div');
            equippoint.className = 'equippoint';
            touxiangkuang.appendChild(equippoint);
            equippoint.innerHTML = get.translation(equip);
            equippoint.type = 'equip';
            equippoint.name = equip;
            equippoint.oncontextmenu = function () {
                const info = document.createElement('div');
                info.className = 'jiangli-info';
                document.body.appendChild(info);
                info.innerHTML = get.translation(`${equip}_info`);
                setTimeout(() => {
                    info.remove();
                }, 2000);
            };
        }
        //——————————————————————————————————————————————————————————出售按钮
        const sellBtn = document.createElement('button');
        sellBtn.className = 'sellBtn';
        sellBtn.innerText = '$';
        sellBtn.onclick = function (e) {
            const callback = function (e) {
                const target = e.target;
                if (target) {
                    const type = target.type;
                    const name = target.name;
                    if (type && name) {
                        if (sellBtn.okkuang) {
                            sellBtn.okkuang.remove();
                        }
                        const okkuang = document.createElement('div');
                        sellBtn.okkuang = okkuang;
                        okkuang.className = 'okkuang';
                        okkuang.innerHTML = `是否将${get.translation(type)}--${get.translation(name)}出售为100金币`;
                        document.body.appendChild(okkuang);
                        const ok = document.createElement('div');
                        ok.className = 'ok-button';
                        ok.innerHTML = '确认出售';
                        okkuang.appendChild(ok);
                        ok.onclick = function () {
                            okkuang.remove();
                            lib.config.shanhe[`cur_${type}`] = lib.config.shanhe[`cur_${type}`].filter(c => c !== name);
                            lib.config.shanhe.cur_jinbi += 100;
                            target.remove(); // 从 DOM 中移除 
                            game.saveConfig('shanhe', lib.config.shanhe);
                            const gongxi = document.createElement('div');
                            gongxi.className = 'gongxi';
                            document.body.appendChild(gongxi);
                            setTimeout(() => {
                                gongxi.remove();
                            }, 2000);
                            gongxi.innerHTML = `将${get.translation(type)}--${get.translation(name)}出售为100金币`;
                        };
                        const cancel = document.createElement('div');
                        cancel.innerHTML = '取消出售';
                        cancel.className = 'cancel-button';
                        okkuang.appendChild(cancel);
                        cancel.onclick = function () {
                            okkuang.remove();
                        };
                    }
                }
            };
            if (!sellBtn.Sell) {
                // 启用出售模式
                sellBtn.Sell = true;
                document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\'><text x=\'0\' y=\'16\' font-size=\'20\'>$</text></svg>"), auto';
                // 监听一次点击
                document.addEventListener('click', callback);
            } else {
                // 退出出售模式
                sellBtn.Sell = false;
                document.body.style.cursor = 'default';
                document.removeEventListener('click', callback);
            }
        };
        shanhe.beijing2.appendChild(sellBtn);
        //——————————————————————————————————————————————————————————金币展示
        const jinbikuang = document.createElement('div');
        jinbikuang.className = 'jinbikuang';
        jinbikuang.innerHTML = `当前金币数量:${lib.config.shanhe.cur_jinbi}`;
        shanhe.beijing2.appendChild(jinbikuang);
    },
    // 结算页面 清除ui.me 终止phaseloop 返回大厅或者初始页面 清空历史记录
    jiesuan(bool) {
        shanhe.zhongzhi = true;
        shanhe.gameDraw.finish();
        shanhe.phaseLoop.finish();
        const players = game.players.concat(game.dead);
        for (const i of players) {
            game.removePlayer(i);
        }
        delete _status.roundStart; // 轮数重置
        game.roundNumber = 0;
        ui.arenalog.innerHTML = ''; /*清除历史记录*/
        ui.historybar.innerHTML = ''; /*清除出牌记录*/
        ui.sidebar.innerHTML = ''; /*清除暂停记录*/
        ui.sidebar3.innerHTML = ''; /*清除暂停记录*/
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
            shanhe.jiangli();
            const chengchiinfo = lib.config.shanhe.chengchi[lib.config.shanhe.cur_chengchi];
            const guankainfo = chengchiinfo[lib.config.shanhe.cur_guanka];
            guankainfo.tongguan = true;
            game.saveConfig('shanhe', lib.config.shanhe);
            let alltongguan = true;
            for (const i in chengchiinfo) {
                if (!chengchiinfo[i].tongguan) {
                    alltongguan = false;
                }
            }
            if (alltongguan) {
                chengchiinfo.tongguan = true;
                game.saveConfig('shanhe', lib.config.shanhe);
                shanhe.shanhetustart();
                return;
            }
        }
        shanhe.chengchistart();
    },
    // 获得<金币/战法/技能/体力上限/手牌上限/初始手牌/装备/队友>奖励
    jiangli() {
        const jianglikuang = document.createElement('div');
        jianglikuang.className = 'jianglikuang';
        document.body.appendChild(jianglikuang);
        const jiangliku = ['jinbi', 'zhanfa', 'skill', 'maxHp', 'maxhandcard', 'equip', 'card', 'friend'];
        const jianglilist = jiangliku.randomGets(3);
        for (const jiangli of jianglilist) {
            const jianglipoint = document.createElement('div');
            jianglipoint.className = 'jianglipoint';
            jianglikuang.appendChild(jianglipoint);
            const jianglititle = document.createElement('div');
            jianglititle.className = 'jianglititle';
            jianglipoint.appendChild(jianglititle);
            jianglititle.innerHTML = get.translation(jiangli);
            const jianglibox = document.createElement('div');
            jianglibox.className = 'jianglibox';
            jianglipoint.appendChild(jianglibox);
            switch (jiangli) {
                case 'jinbi':
                    {
                        jianglibox.setBackground('extension/火灵月影/image/jinbi.jpg');
                    }
                    break;
                case 'maxHp':
                    {
                        jianglibox.setBackground('extension/火灵月影/image/maxHp.jpg');
                    }
                    break;
                case 'maxhandcard':
                    {
                        jianglibox.setBackground('extension/火灵月影/image/maxhandcard.jpg');
                    }
                    break;
                default:
                    {
                        jianglipoint.name = shanhe[`${jiangli}list`].randomGet();
                        jianglibox.innerHTML = get.translation(jianglipoint.name);
                        if (jiangli == 'friend') {
                            jianglipoint.oncontextmenu = function () {
                                ui.click.charactercard(jianglipoint.name, null, null, true, jianglipoint);
                            };
                        } else {
                            jianglipoint.oncontextmenu = function () {
                                const info = document.createElement('div');
                                info.className = 'jiangli-info';
                                document.body.appendChild(info);
                                info.innerHTML = get.translation(`${jianglipoint.name}_info`);
                                setTimeout(() => {
                                    info.remove();
                                }, 2000);
                            };
                        }
                        if (['equip', 'card'].includes(jiangli)) {
                            jianglibox.setBackgroundImage(game.cardsrc(jianglipoint.name, 'card'));
                        }
                        if ('friend' == jiangli) {
                            jianglibox.setBackground(jianglipoint.name, 'character');
                        }
                        if ('zhanfa' == jiangli) {
                            jianglibox.setBackground(shanhe.zhanfamap[jianglipoint.name], 'character');
                        }
                    }
                    break;
            }
            jianglipoint.type = jiangli;
            jianglipoint.onclick = function () {
                jianglikuang.selecttype = this.type;
                jianglikuang.selectname = this.name;
                if (jianglikuang.lastselect) {
                    jianglikuang.lastselect.style.boxShadow = 'none';
                }
                jianglikuang.lastselect = jianglipoint;
                jianglipoint.style.boxShadow = '-5px 0px 5px rgba(255,255,0,0.75),0px -5px 5px rgba(255,255,0,0.75),5px 0px 5px rgba(255,255,0,0.75),0px 5px 5px rgba(255,255,0,0.75)';
            };
        }
        const ok = document.createElement('div');
        ok.innerHTML = '确认奖励';
        ok.className = 'ok-button';
        jianglikuang.appendChild(ok);
        ok.onclick = function () {
            if (!jianglikuang.selecttype) {
                alert('请先选择一项奖励');
                return;
            }
            jianglikuang.remove();
            const gongxi = document.createElement('div');
            gongxi.className = 'gongxi';
            document.body.appendChild(gongxi);
            setTimeout(() => {
                gongxi.remove();
            }, 2000);
            switch (jianglikuang.selecttype) {
                case 'jinbi':
                    {
                        lib.config.shanhe.cur_jinbi += 100;
                        gongxi.innerHTML = `获得了100金币`;
                    }
                    break;
                case 'maxHp':
                    {
                        lib.config.shanhe.cur_maxHp++;
                        gongxi.innerHTML = `体力上限增加了`;
                    }
                    break;
                case 'maxhandcard':
                    {
                        lib.config.shanhe.cur_maxhandcard++;
                        gongxi.innerHTML = `手牌上限增加了`;
                    }
                    break;
                case 'zhanfa':
                    {
                        lib.config.shanhe.cur_zhanfa.push(jianglikuang.selectname);
                        gongxi.innerHTML = `获得了战法${get.translation(jianglikuang.selectname)}`;
                    }
                    break;
                case 'skill':
                    {
                        lib.config.shanhe.cur_skill.push(jianglikuang.selectname);
                        gongxi.innerHTML = `获得了技能${get.translation(jianglikuang.selectname)}`;
                    }
                    break;
                case 'equip':
                    {
                        lib.config.shanhe.cur_equip.push(jianglikuang.selectname);
                        gongxi.innerHTML = `获得了装备${get.translation(jianglikuang.selectname)}`;
                    }
                    break;
                case 'card':
                    {
                        lib.config.shanhe.cur_card.push(jianglikuang.selectname);
                        gongxi.innerHTML = `获得了初始手牌${get.translation(jianglikuang.selectname)}`;
                    }
                    break;
                case 'friend':
                    {
                        lib.config.shanhe.cur_friend.push(jianglikuang.selectname);
                        gongxi.innerHTML = `获得了盟友${get.translation(jianglikuang.selectname)}`;
                    }
                    break;
            }
            game.saveConfig('shanhe', lib.config.shanhe);
        };
    },
    // 选择武将
    xuanjiang() {
        if (shanhe.xuanjiangkuang) {
            shanhe.xuanjiangkuang.remove();
        }
        const body = ui.create.div('.xuanjiangkuang', shanhe.beijing1);
        const groupBody = ui.create.div('.packlist', body);
        lib.setScroll(groupBody);
        if (!lib.config.touchscreen && lib.config.mousewheel) {
            groupBody._scrollspeed = 30;
            groupBody._scrollnum = 10;
            groupBody.onmousewheel = ui.click.mousewheel;
        } //水平滚动
        const playBody = ui.create.div('.wujiangkuang', body);
        lib.setScroll(playBody);
        const packlist = Object.keys(lib.characterPack); //QQQ点将全扩
        for (const pack of packlist) {
            const packpoint = ui.create.div('.packpoint', groupBody); //QQQ
            packpoint.innerHTML = get.translation(pack + '_character_config');
            packpoint.listen(function () {
                while (playBody.firstChild) {
                    playBody.firstChild.remove();
                }
                if (groupBody.packpoint) {
                    groupBody.packpoint.style.backgroundImage = 'none';
                }
                groupBody.packpoint = packpoint;
                packpoint.setBackgroundImage('extension/火灵月影/image/icon_point1.png');
                const playlist = Object.keys(lib.characterPack[pack]);
                for (const play of playlist) {
                    const touxiang = ui.create.div('.touxiang', playBody);
                    const playImp1 = ui.create.div('.touxiang1', touxiang);
                    const playImp2 = ui.create.div('.touxiang2', playImp1);
                    const nameText = ui.create.div('.touxiangtext', playImp1);
                    playImp2.setBackground(play, 'character');
                    nameText.innerHTML = lib.translate[play];
                    touxiang.listen(function () {
                        lib.config.shanhe.cur_xuanjiang = play;
                        game.saveConfig('shanhe', lib.config.shanhe);
                        if (playBody.touxiang) {
                            playBody.touxiang.style.boxShadow = 'none';
                        }
                        playBody.touxiang = touxiang;
                        touxiang.style.boxShadow = '-5px 0px 5px rgba(0,255,0,0.75),0px -5px 5px rgba(0,255,0,0.75),5px 0px 5px rgba(0,255,0,0.75),0px 5px 5px rgba(0,255,0,0.75)';
                    });
                    touxiang.oncontextmenu = function () {
                        ui.click.charactercard(play, null, null, true, this);
                    };
                    touxiang.onmouseover = function () {
                        if (lib.config.shanhe.cur_xuanjiang != play) {
                            touxiang.style.boxShadow = '-5px 0px 5px rgba(255,255,0,0.75),0px -5px 5px rgba(255,255,0,0.75),5px 0px 5px rgba(255,255,0,0.75),0px 5px 5px rgba(255,255,0,0.75)';
                        }
                    };
                    touxiang.onmouseout = function () {
                        if (lib.config.shanhe.cur_xuanjiang != play) {
                            touxiang.style.boxShadow = 'none';
                        }
                    };
                }
            });
        }
        const okButton = ui.create.div('.xuanjiangok', '确认选择', body);
        okButton.listen(function () {
            body.remove();
            shanhe.dianjiang();
        });
        shanhe.xuanjiangkuang = body;
    },
    // 展示点将框
    dianjiang() {
        const dianjiang = document.createElement('div');
        dianjiang.className = 'dianjiang';
        dianjiang.innerHTML = '出战武将';
        dianjiang.onclick = function () {
            shanhe.xuanjiang();
        };
        dianjiang.oncontextmenu = function () {
            ui.click.charactercard(lib.config.shanhe.cur_xuanjiang, null, null, true, dianjiang);
        };
        shanhe.beijing1.appendChild(dianjiang);
        const touxiang = document.createElement('div');
        touxiang.setBackground(lib.config.shanhe.cur_xuanjiang, 'character');
        touxiang.className = 'touxiangQ';
        dianjiang.appendChild(touxiang);
    },
    // 重置通关记录/城池与关卡boss刷新
    chongzhijilu() {
        if (!lib.config.mode_config.shanhetu) {
            lib.config.mode_config.shanhetu = {
                难度: '3',
                城池数量: '3',
                关卡数量: '3',
                boss数量: '3',
            };
        }
        const config = lib.config.mode_config.shanhetu;
        const nandu = Number(config.难度);
        const chengchinum = Number(config.城池数量);
        const guankanum = Number(config.关卡数量);
        const bossnum = Number(config.boss数量);
        lib.config.shanhe.chengchi = {};
        const shanheinfo = lib.config.shanhe.chengchi;
        let num = chengchinum + 1;
        while (num-- > 1) {
            shanheinfo[`chengchi${num}`] = {};
            const chengchiinfo = shanheinfo[`chengchi${num}`];
            let numx = guankanum + 1;
            while (numx-- > 1) {
                chengchiinfo[`guanka${numx}`] = {};
                const guankainfo = chengchiinfo[`guanka${numx}`];
                let numy = bossnum + 1;
                while (numy-- > 1) {
                    guankainfo[`boss${numy}`] = {
                        name: shanhe.friendlist.randomGet(),
                        sex: 'female',
                        skills: shanhe.skilllist.randomGets(nandu),
                        hujia: Math.ceil(Math.random() * nandu),
                        maxHp: Math.ceil(Math.random() * nandu),
                    };
                }
            }
        }
        game.saveConfig('shanhe', lib.config.shanhe);
    },
};
game.addMode(
    'shanhetu',
    {
        start() {
            document.removeEventListener('contextmenu', ui.click.right); //移除右键事件
            lib.config.mode = 'shanhetu';
            _status.mode = 'shanhetu';
            game.finishCards();
            if (!shanhe.skilllist) {
                shanhe.skilllist = Object.keys(lib.skill).filter((i) => lib.translate[i] && lib.translate[`${i}_info`]);
            }
            if (!shanhe.friendlist) {
                shanhe.friendlist = Object.keys(lib.character);
            }
            if (!shanhe.zhanfamap) {
                shanhe.zhanfamap = {};
                for (const i in lib.character) {
                    const info = lib.character[i];
                    if (info.skills) {
                        for (const skill of info.skills) {
                            if (lib.translate[skill] && lib.translate[`${skill}_info`]) {
                                shanhe.zhanfamap[skill] = i;
                            }
                        }
                    }
                }
                shanhe.zhanfalist = Object.keys(shanhe.zhanfamap);
            } // 键为战法技能名,值为来源的武将名,方便设置战法头像
            if (!shanhe.equiplist) {
                shanhe.equiplist = [];
                for (const i in lib.card) {
                    const info = lib.card[i];
                    if (info.type == 'equip' && lib.translate[i] && lib.translate[`${i}_info`]) {
                        shanhe.equiplist.push(i);
                    }
                }
            }
            if (!shanhe.cardlist) {
                shanhe.cardlist = [];
                for (const i in lib.card) {
                    const info = lib.card[i];
                    if (info.mode && !info.mode.includes(lib.config.mode)) continue;
                    if (info.type != 'equip' && lib.translate[i] && lib.translate[`${i}_info`]) {
                        shanhe.cardlist.push(i);
                    }
                }
            }
            if (!lib.config.shanhe) {
                lib.config.shanhe = {};
            }
            lib.config.shanhe = {
                cur_xuanjiang: lib.config.shanhe.cur_xuanjiang, //当前已选武将
                cur_chengchi: lib.config.shanhe.cur_chengchi, //当前城池
                cur_guanka: lib.config.shanhe.cur_guanka, //当前关卡
                chengchi: lib.config.shanhe.chengchi, //通关记录
                cur_zhanfa: lib.config.shanhe.cur_zhanfa || [], // 当前战法
                cur_skill: lib.config.shanhe.cur_skill || [], // 当前额外技能
                cur_maxHp: lib.config.shanhe.cur_maxHp || 0, // 当前额外体力
                cur_maxhandcard: lib.config.shanhe.cur_maxhandcard || 0, // 当前额外手牌上限
                cur_equip: lib.config.shanhe.cur_equip || [], // 当前初始装备
                cur_card: lib.config.shanhe.cur_card || [], // 当前初始手牌
                cur_friend: lib.config.shanhe.cur_friend || [], // 当前队友
                cur_jinbi: lib.config.shanhe.cur_jinbi || 0, // 当前金币
            };
            if (!lib.config.shanhe.chengchi) {
                shanhe.chongzhijilu();
            }
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
                    }// 不手动设置seatnum会导致phaseloop自动设置,导致_status.seatNumSettled是真值,导致用phase抢回合会增加轮数
                    // 只有身份模式下,由于手动设置了seatnum,抢回合不会更新轮数
                    // 解决方法:删除所有setseatnum,修改setseatnum,手动设置seatnum,修改phaseloop,锁定_status.seatNumSettled
                    // 但是insertphase抢回合就不会刷新轮数,因为lib.onround检测此回合有event.skill
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
            _shanhe_maxhandcard: {
                mod: {
                    maxHandcard(player, num) {
                        if (player == game.me && lib.config.shanhe.cur_maxhandcard > 0) {
                            return num + lib.config.shanhe.cur_maxhandcard;
                        }
                    },
                },
            },
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
        translate: {
            fan: '反',
            zhong: '忠',
            zhu: '主',
            jinbi: '金币',
            zhanfa: '战法',
            skill: '技能',
            maxHp: '体力上限',
            maxhandcard: '手牌上限',
            equip: '装备',
            card: '初始手牌',
            friend: '盟友',
        },
    },
    {
        translate: '山河图',
        config: {
            intro: {
                name: '山河图',
                frequent: true,
                clear: true,
            },
            难度: {
                name: '<span class=Qmenu>难度</span>',
                intro: '设置关卡中boss的强度(技能数/护甲值/体力值),修改后需要重置山河图通关记录',
                frequent: true,
                init: '3',
                item: {
                    1: '<span class=Qmenu>1</span>',
                    2: '<span class=Qmenu>2</span>',
                    3: '<span class=Qmenu>3</span>',
                    4: '<span class=Qmenu>4</span>',
                    5: '<span class=Qmenu>5</span>',
                    6: '<span class=Qmenu>6</span>',
                    7: '<span class=Qmenu>7</span>',
                    8: '<span class=Qmenu>8</span>',
                },
            },
            城池数量: {
                name: '<span class=Qmenu>城池数量</span>',
                intro: '设置山河图总共城池的数量,修改后需要重置山河图通关记录',
                frequent: true,
                init: '3',
                item: {
                    1: '<span class=Qmenu>1</span>',
                    2: '<span class=Qmenu>2</span>',
                    3: '<span class=Qmenu>3</span>',
                    4: '<span class=Qmenu>4</span>',
                    5: '<span class=Qmenu>5</span>',
                    6: '<span class=Qmenu>6</span>',
                    7: '<span class=Qmenu>7</span>',
                    8: '<span class=Qmenu>8</span>',
                },
            },
            关卡数量: {
                name: '<span class=Qmenu>关卡数量</span>',
                intro: '设置城池中关卡的数量,修改后需要重置山河图通关记录',
                frequent: true,
                init: '3',
                item: {
                    1: '<span class=Qmenu>1</span>',
                    2: '<span class=Qmenu>2</span>',
                    3: '<span class=Qmenu>3</span>',
                    4: '<span class=Qmenu>4</span>',
                    5: '<span class=Qmenu>5</span>',
                    6: '<span class=Qmenu>6</span>',
                    7: '<span class=Qmenu>7</span>',
                    8: '<span class=Qmenu>8</span>',
                },
            },
            boss数量: {
                name: '<span class=Qmenu>boss数量</span>',
                intro: '设置关卡中boss的数量,修改后需要重置山河图通关记录',
                frequent: true,
                init: '3',
                item: {
                    1: '<span class=Qmenu>1</span>',
                    2: '<span class=Qmenu>2</span>',
                    3: '<span class=Qmenu>3</span>',
                    4: '<span class=Qmenu>4</span>',
                    5: '<span class=Qmenu>5</span>',
                    6: '<span class=Qmenu>6</span>',
                    7: '<span class=Qmenu>7</span>',
                    8: '<span class=Qmenu>8</span>',
                },
            },
            重置通关记录: {
                name: '<span class=Qmenu>重置通关记录</span>',
                frequent: true,
                clear: true,
                onclick() {
                    if (_status.mode == 'shanhetu') {
                        shanhe.chongzhijilu();
                        alert('重置通关记录成功,将会为您重启');
                        game.reload();
                    } else {
                        alert('只有在山河图模式下才可以重置通关记录');
                    }
                },
            },
        },
    }
);
lib.mode.shanhetu.splash = 'ext:火灵月影/image/shanhetu.jpg';
