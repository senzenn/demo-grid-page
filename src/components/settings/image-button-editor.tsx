"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Image as ImageIcon } from 'lucide-react';
import type { ProductConfig } from '@/app/dashboard/settings/page';

interface ImageButtonEditorProps {
  config: ProductConfig;
  onUpdate: (updates: Partial<ProductConfig>) => void;
}

export function ImageButtonEditor({ config, onUpdate }: ImageButtonEditorProps) {
  return (
    <div className="space-y-4">
      {/* Image Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
          <CardDescription>
            Add an image to showcase your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={config.imageUrl}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              />
              <Button variant="outline" size="icon" title="Upload image">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a URL or click upload to add an image
            </p>
          </div>

          {config.imageUrl && (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.imageUrl}
                alt="Product preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {!config.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No image</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Button Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Button Configuration</CardTitle>
          <CardDescription>
            Customize the appearance and text of your payment button
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              placeholder="e.g., Subscribe, Buy Now, Pay"
              value={config.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="button-style">Button Style</Label>
            <Select
              value={config.buttonStyle}
              onValueChange={(value: ProductConfig['buttonStyle']) =>
                onUpdate({ buttonStyle: value })
              }
            >
              <SelectTrigger id="button-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="pill">Pill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

