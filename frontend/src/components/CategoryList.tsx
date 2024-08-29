import React, { useState } from 'react'
import ColorPickerModal from './ColorPickerModal'
import styles from './CategoryList.module.scss'
import { CategoryEntity } from '@/app/_api/category'

interface CategoryListProps {
    categories: CategoryEntity[]
    onSelectCategory: (category: string) => void
    onSelectCategoryAndColor: (category: string, color: number[]) => void
}

export default function CategoryList({
    categories,
    onSelectCategory,
    onSelectCategoryAndColor,
}: CategoryListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    )
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedCategoryColor, setSelectedCategoryColor] = useState<{
        [key: string]: string
    }>({})
    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            // 선택된 카테고리를 다시 클릭하면 선택 해제
            setSelectedCategory(null)
            setSelectedCategoryColor(prev => {
                const newColors = { ...prev }
                delete newColors[category]
                return newColors
            })
            onSelectCategory('') // 선택 해제 시 빈 문자열로 선택 해제 알림
        } else {
            // 새로운 카테고리 선택
            setSelectedCategory(category)
            setModalVisible(true)
        }
    }
    const handleColorComplete = (color: string) => {
        if (selectedCategory) {
            const rgbColor = color.match(/\d+/g)?.map(Number) || []
            setSelectedCategoryColor(prev => ({
                ...prev,
                [selectedCategory]: color,
            }))
            onSelectCategoryAndColor(selectedCategory, rgbColor)
        }
        setModalVisible(false)
    }

    const handleCategoryOnlySelect = () => {
        if (selectedCategory) {
            onSelectCategory(selectedCategory)
        }
        setModalVisible(false)
    }

    const handleCloseModal = () => {
        setSelectedCategory(null) // 카테고리 선택 해제
        setModalVisible(false) // 모달 닫기
    }

    return (
        <div className={styles.categoryList}>
            {categories.map(category => (
                <button
                    key={category.categoryId}
                    className={`${styles.categoryButton} ${
                        selectedCategory === category.categoryContent
                            ? selectedCategoryColor[category.categoryContent]
                                ? styles.colored
                                : styles.selected
                            : ''
                    }`}
                    style={{
                        backgroundColor:
                            selectedCategoryColor[category.categoryContent] ||
                            'transparent',
                        borderColor: selectedCategoryColor[
                            category.categoryContent
                        ]
                            ? 'transparent'
                            : selectedCategory === category.categoryContent
                              ? '#000' // 선택된 카테고리일 때 검정 모서리
                              : '#D3D3D3', // 기본 상태에서 아주 연한 회색 모서리
                        color: selectedCategoryColor[category.categoryContent]
                            ? isBrightColor(
                                  selectedCategoryColor[
                                      category.categoryContent
                                  ],
                              )
                                ? '#000000'
                                : '#FFFFFF'
                            : selectedCategory === category.categoryContent
                              ? '#333' // 카테고리만 선택된 경우 기본 텍스트 색상 유지
                              : '#898989', // 기본 텍스트 색상
                    }}
                    onClick={() =>
                        handleCategoryClick(category.categoryContent)
                    }
                >
                    {category.categoryContent}
                </button>
            ))}
            {modalVisible && (
                <ColorPickerModal
                    onComplete={handleColorComplete}
                    onClose={handleCloseModal} // 수정된 onClose 핸들러 사용
                    onCategoryOnlySelect={handleCategoryOnlySelect}
                    onResetCategory={handleCloseModal} // 카테고리 선택 초기화를 위한 핸들러 추가
                />
            )}
        </div>
    )
}
function isBrightColor(color: string): boolean {
    let r: number, g: number, b: number
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g)
        r = parseInt(match![0], 10)
        g = parseInt(match![1], 10)
        b = parseInt(match![2], 10)
    } else if (color.startsWith('hsl')) {
        const match = color.match(/\d+/g)
        const h = parseInt(match![0], 10)
        const s = parseInt(match![1], 10)
        const l = parseInt(match![2], 10)
        ;[r, g, b] = hslToRgb(h, s, l)
    } else {
        r = parseInt(color.substring(1, 3), 16)
        g = parseInt(color.substring(3, 5), 16)
        b = parseInt(color.substring(5, 7), 16)
    }

    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 186
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [
        Math.round(f(0) * 255),
        Math.round(f(8) * 255),
        Math.round(f(4) * 255),
    ]
}
