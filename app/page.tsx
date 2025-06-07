import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

// サンプルデータ
const nomikaiList = [
  {
    id: 1,
    title: "新年会",
    description: "2025年の新年を祝う飲み会",
    status: "planning",
    participants: 8,
    location: "渋谷エリア",
    estimatedDate: "2025年1月中旬",
  },
  {
    id: 2,
    title: "歓送迎会",
    description: "新メンバーの歓迎と退職者の送別会",
    status: "scheduled",
    participants: 12,
    location: "新宿エリア",
    scheduledDate: "2025年1月25日 19:00",
  },
  {
    id: 3,
    title: "プロジェクト打ち上げ",
    description: "大型プロジェクト完了の打ち上げ",
    status: "planning",
    participants: 6,
    location: "品川エリア",
    estimatedDate: "2025年2月上旬",
  },
  {
    id: 4,
    title: "月例飲み会",
    description: "毎月恒例のチーム飲み会",
    status: "planning",
    participants: 10,
    location: "池袋エリア",
    estimatedDate: "2025年2月第2週",
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">飲み会管理</h1>
        <p className="text-muted-foreground">予定されている飲み会の一覧です</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nomikaiList.map((nomikai) => (
          <Card key={nomikai.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{nomikai.title}</CardTitle>
                  <CardDescription className="mt-2">{nomikai.description}</CardDescription>
                </div>
                <Badge variant={nomikai.status === "scheduled" ? "default" : "secondary"}>
                  {nomikai.status === "scheduled" ? "確定済み" : "調整中"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{nomikai.participants}名参加予定</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{nomikai.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {nomikai.status === "scheduled" ? (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>{nomikai.scheduledDate}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      <span>{nomikai.estimatedDate}</span>
                    </>
                  )}
                </div>

                <div className="pt-4">
                  {nomikai.status === "planning" ? (
                    <Link href={`/schedule/${nomikai.id}`}>
                      <Button className="w-full">日程を確定する</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      日程確定済み
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
